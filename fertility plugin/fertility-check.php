<?php
/**
 * Plugin Name: SORA Fertility
 * Description: SORA Fertility risk awareness widget that requests private server-side assessment results.
 * Version: 1.2.0
 * Author: SORA
 * License: GPLv2 or later
 * Text Domain: fertility-check
 */

if (!defined('ABSPATH')) {
    exit;
}

define('FERTILITY_CHECK_VERSION', '1.2.0');
define('FERTILITY_CHECK_URL', plugin_dir_url(__FILE__));
define('FERTILITY_CHECK_PATH', plugin_dir_path(__FILE__));
define('FERTILITY_CHECK_DEFAULT_API_URL', 'https://sora-fertility-bot.onrender.com/api/assess');

function fertility_check_enqueue_assets() {
    wp_enqueue_style(
        'fertility-check-widget',
        FERTILITY_CHECK_URL . 'assets/css/widget-style.css',
        array(),
        FERTILITY_CHECK_VERSION
    );

    wp_enqueue_script(
        'fertility-check-widget',
        FERTILITY_CHECK_URL . 'assets/js/fertility-widget.js',
        array(),
        FERTILITY_CHECK_VERSION,
        true
    );

    wp_localize_script('fertility-check-widget', 'FertilityCheckConfig', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('fertility_check_report'),
        'assessmentApiUrl' => esc_url_raw(get_option('fertility_check_assessment_api_url', FERTILITY_CHECK_DEFAULT_API_URL)),
        'clinicId' => sanitize_text_field(get_option('fertility_check_clinic_id', '')),
    ));
}
add_action('wp_enqueue_scripts', 'fertility_check_enqueue_assets');

function fertility_check_render_widget() {
    fertility_check_enqueue_assets();

    return '<div class="fertility-widget" data-fertility-widget></div>';
}
add_shortcode('fertility_check', 'fertility_check_render_widget');

function fertility_check_register_block() {
    wp_register_style(
        'fertility-check-editor-block',
        FERTILITY_CHECK_URL . 'assets/css/editor-block.css',
        array(),
        FERTILITY_CHECK_VERSION
    );

    wp_register_script(
        'fertility-check-block',
        FERTILITY_CHECK_URL . 'assets/js/block.js',
        array('wp-blocks', 'wp-element', 'wp-i18n', 'wp-components'),
        FERTILITY_CHECK_VERSION,
        true
    );

    register_block_type('fertility-check/fertility-widget', array(
        'editor_script' => 'fertility-check-block',
        'editor_style'  => 'fertility-check-editor-block',
        'render_callback' => 'fertility_check_render_widget',
    ));
}
add_action('init', 'fertility_check_register_block');

function fertility_check_activate() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'fertility_check_reports';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        created_at DATETIME NOT NULL,
        name VARCHAR(190) NOT NULL DEFAULT '',
        email VARCHAR(190) NOT NULL DEFAULT '',
        phone VARCHAR(60) NOT NULL DEFAULT '',
        sex VARCHAR(60) NOT NULL DEFAULT '',
        age VARCHAR(20) NOT NULL DEFAULT '',
        risk_category VARCHAR(40) NOT NULL DEFAULT '',
        referral_urgency VARCHAR(190) NOT NULL DEFAULT '',
        red_count INT NOT NULL DEFAULT 0,
        amber_count INT NOT NULL DEFAULT 0,
        triage_index INT NOT NULL DEFAULT 0,
        ovarian_reserve VARCHAR(190) NOT NULL DEFAULT '',
        report_file VARCHAR(255) NOT NULL DEFAULT '',
        report_url VARCHAR(255) NOT NULL DEFAULT '',
        report_requested TINYINT(1) NOT NULL DEFAULT 0,
        payload LONGTEXT NOT NULL,
        PRIMARY KEY  (id),
        KEY email (email),
        KEY phone (phone),
        KEY risk_category (risk_category)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'fertility_check_activate');

function fertility_check_handle_report_request() {
    check_ajax_referer('fertility_check_report', 'nonce');

    $payload = json_decode(stripslashes($_POST['payload'] ?? ''), true);
    if (!is_array($payload)) {
        wp_send_json_error(array('message' => 'Invalid report payload.'), 400);
    }

    $email = sanitize_email($payload['report_delivery_email'] ?? $payload['email'] ?? '');
    if (!$email || !is_email($email)) {
        wp_send_json_error(array('message' => 'A valid email is required.'), 400);
    }

    $name = sanitize_text_field($payload['name'] ?? $payload['userName'] ?? '');
    $phone = sanitize_text_field($payload['phone'] ?? $payload['mobile'] ?? '');
    $sex = sanitize_text_field($payload['sex'] ?? '');
    $age = sanitize_text_field($payload['age'] ?? '');
    $risk_category = sanitize_text_field($payload['risk_category'] ?? '');
    $referral_urgency = sanitize_text_field($payload['referral_urgency'] ?? '');
    $red_count = intval($payload['red_count'] ?? 0);
    $amber_count = intval($payload['amber_count'] ?? 0);
    $triage_index = intval($payload['triage_index'] ?? 0);
    $ovarian_reserve = fertility_check_ovarian_reserve_label($payload['ovarian_reserve'] ?? null);
    $report_file = fertility_check_generate_report_pdf($payload);
    $report_url = $report_file ? fertility_check_report_url_from_path($report_file) : '';

    fertility_check_activate();

    global $wpdb;
    $table_name = $wpdb->prefix . 'fertility_check_reports';

    $inserted = $wpdb->insert(
        $table_name,
        array(
            'created_at' => current_time('mysql'),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'sex' => $sex,
            'age' => $age,
            'risk_category' => $risk_category,
            'referral_urgency' => $referral_urgency,
            'red_count' => $red_count,
            'amber_count' => $amber_count,
            'triage_index' => $triage_index,
            'ovarian_reserve' => $ovarian_reserve,
            'report_file' => $report_file,
            'report_url' => $report_url,
            'report_requested' => !empty($payload['report_requested']) ? 1 : 0,
            'payload' => wp_json_encode($payload),
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%d', '%d', '%s', '%s', '%s', '%d', '%s')
    );

    if (!$inserted) {
        wp_send_json_error(array('message' => 'Could not save report request.'), 500);
    }

    $sent = fertility_check_send_report_email($email, $payload, $report_file);
    fertility_check_send_admin_notification($payload, $report_file, $wpdb->insert_id);
    if (!$sent) {
        wp_send_json_error(array(
            'message' => 'Report was saved, but email sending failed. Check WordPress mail/SMTP configuration.',
            'saved' => true,
            'report_id' => $wpdb->insert_id,
        ), 500);
    }

    wp_send_json_success(array(
        'message' => 'Report saved and email sent.',
        'report_id' => $wpdb->insert_id,
        'report_url' => $report_url,
    ));
}
add_action('wp_ajax_fertility_check_report', 'fertility_check_handle_report_request');
add_action('wp_ajax_nopriv_fertility_check_report', 'fertility_check_handle_report_request');

function fertility_check_register_settings() {
    register_setting('fertility_check_settings', 'fertility_check_assessment_api_url', array(
        'type' => 'string',
        'sanitize_callback' => 'esc_url_raw',
        'default' => FERTILITY_CHECK_DEFAULT_API_URL,
    ));

    register_setting('fertility_check_settings', 'fertility_check_clinic_id', array(
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => '',
    ));
}
add_action('admin_init', 'fertility_check_register_settings');

function fertility_check_ovarian_reserve_label($reserve) {
    if (!is_array($reserve)) {
        return '';
    }

    $description = sanitize_text_field($reserve['reserve'] ?? '');
    $cluster = sanitize_text_field($reserve['cluster'] ?? '');

    if ($description && $cluster) {
        return $description . ' (Cluster ' . $cluster . ')';
    }

    return $description;
}

function fertility_check_send_report_email($email, $payload, $report_file = '') {
    $name = sanitize_text_field($payload['name'] ?? $payload['userName'] ?? 'there');
    $subject_name = $name ? $name : 'Your';
    $subject = $subject_name . ' - SORA Fertility Awareness Report';
    $headers = array('Content-Type: text/html; charset=UTF-8');
    $body = fertility_check_build_report_email_html($payload);

    $attachments = $report_file && file_exists($report_file) ? array($report_file) : array();

    return wp_mail($email, $subject, $body, $headers, $attachments);
}

function fertility_check_send_admin_notification($payload, $report_file = '', $report_id = 0) {
    $admin_email = get_option('admin_email');
    if (!$admin_email || !is_email($admin_email)) {
        return false;
    }

    $name = sanitize_text_field($payload['name'] ?? $payload['userName'] ?? '');
    $risk = strtoupper(sanitize_text_field($payload['risk_category'] ?? ''));
    $urgency = sanitize_text_field($payload['referral_urgency'] ?? '');
    $subject = 'New fertility report request' . ($risk ? ' - ' . $risk : '');
    $headers = array('Content-Type: text/html; charset=UTF-8');
    $attachments = $report_file && file_exists($report_file) ? array($report_file) : array();

    $body = '<div style="font-family:Arial,sans-serif;color:#24313d;line-height:1.5;">';
    $body .= '<h2>New Fertility Report Request</h2>';
    $body .= '<p><strong>Report ID:</strong> ' . intval($report_id) . '</p>';
    $body .= '<p><strong>Name:</strong> ' . esc_html($name) . '</p>';
    $body .= '<p><strong>Email:</strong> ' . esc_html($payload['email'] ?? $payload['report_delivery_email'] ?? '') . '</p>';
    $body .= '<p><strong>Phone:</strong> ' . esc_html($payload['phone'] ?? $payload['mobile'] ?? '') . '</p>';
    $body .= '<p><strong>Risk:</strong> ' . esc_html($risk) . '</p>';
    $body .= '<p><strong>Referral urgency:</strong> ' . esc_html($urgency) . '</p>';
    $body .= '<p>View saved submissions in WordPress Admin &gt; SORA Fertility Reports.</p>';
    $body .= '</div>';

    return wp_mail($admin_email, $subject, $body, $headers, $attachments);
}

function fertility_check_build_report_email_html($payload) {
    $name = esc_html($payload['name'] ?? $payload['userName'] ?? '');
    $age = esc_html($payload['age'] ?? '');
    $sex = esc_html($payload['sex'] ?? '');
    $phone = esc_html($payload['phone'] ?? $payload['mobile'] ?? '');
    $risk = strtoupper(esc_html($payload['risk_category'] ?? ''));
    $urgency = esc_html($payload['referral_urgency'] ?? '');
    $red = intval($payload['red_count'] ?? 0);
    $amber = intval($payload['amber_count'] ?? 0);
    $ovarian = esc_html(fertility_check_ovarian_reserve_label($payload['ovarian_reserve'] ?? null));
    $flagged = is_array($payload['flagged_factors'] ?? null) ? $payload['flagged_factors'] : array();
    $triggers = is_array($payload['referral_triggers'] ?? null) ? $payload['referral_triggers'] : array();

    $html = '<div style="font-family:Arial,sans-serif;color:#24313d;line-height:1.5;max-width:720px;margin:0 auto;">';
    $html .= '<div style="background:#24313d;color:#fff;padding:22px;border-radius:10px 10px 0 0;">';
    $html .= '<h1 style="margin:0;font-size:24px;">SORA Fertility Awareness Report</h1>';
    $html .= '<p style="margin:8px 0 0;color:#dfe8e2;">Evidence-aligned risk summary for clinician discussion</p>';
    $html .= '</div>';
    $html .= '<div style="border:1px solid #e3e7e2;border-top:0;padding:20px;border-radius:0 0 10px 10px;">';
    $html .= '<table style="width:100%;border-collapse:collapse;margin-bottom:18px;"><tbody>';
    $html .= fertility_check_email_row('Name', $name);
    $html .= fertility_check_email_row('Age', $age);
    $html .= fertility_check_email_row('Sex', $sex);
    $html .= fertility_check_email_row('Mobile', $phone);
    $html .= fertility_check_email_row('Overall Risk', $risk);
    $html .= fertility_check_email_row('Referral Urgency', $urgency);
    $html .= fertility_check_email_row('Red / Amber Factors', $red . ' red, ' . $amber . ' amber');
    if ($ovarian) {
        $html .= fertility_check_email_row('Ovarian Reserve', $ovarian);
    }
    $html .= '</tbody></table>';

    if (!empty($triggers)) {
        $html .= '<h2 style="font-size:18px;">Clinical Referral Triggers</h2><ul>';
        foreach ($triggers as $trigger) {
            $html .= '<li>' . esc_html($trigger) . '</li>';
        }
        $html .= '</ul>';
    }

    $html .= '<h2 style="font-size:18px;">Flagged Factors</h2>';
    if (!empty($flagged)) {
        foreach ($flagged as $factor) {
            $level = esc_html($factor['level'] ?? '');
            $title = esc_html($factor['title'] ?? '');
            $label = esc_html($factor['label'] ?? '');
            $color = $level === 'red' ? '#a93f3f' : '#d39a27';
            $html .= '<div style="border-left:4px solid ' . $color . ';background:#fbfcfb;padding:10px 12px;margin:10px 0;">';
            $html .= '<strong>' . $title . '</strong><br><span>' . $label . '</span>';
            $html .= '</div>';
        }
    } else {
        $html .= '<p>No red or amber factors were identified from the answers provided.</p>';
    }

    $html .= '<p style="font-size:13px;color:#5c6962;margin-top:18px;"><strong>Scientific basis:</strong> FertiSTAT: Bunting L, Boivin J. Human Reproduction. 2010;25(7):1722-1733. AAFA/AFA: Xu H, et al. J Assist Reprod Genet. 2020;37(4):963-972.</p>';
    $html .= '<p style="font-size:13px;color:#5c6962;">This is an educational risk-awareness report, not a diagnosis, treatment plan, or prediction of pregnancy.</p>';
    $html .= '</div></div>';

    return $html;
}

function fertility_check_email_row($label, $value) {
    return '<tr><td style="padding:8px;border-bottom:1px solid #edf0ed;color:#63716b;width:34%;">' . esc_html($label) . '</td><td style="padding:8px;border-bottom:1px solid #edf0ed;"><strong>' . $value . '</strong></td></tr>';
}

function fertility_check_generate_report_pdf($payload) {
    $upload = wp_upload_dir();
    if (!empty($upload['error'])) {
        return '';
    }

    $dir = trailingslashit($upload['basedir']) . 'fertility-check-reports';
    if (!wp_mkdir_p($dir)) {
        return '';
    }

    $name = sanitize_title($payload['name'] ?? $payload['userName'] ?? 'fertility-report');
    $age = sanitize_title($payload['age'] ?? 'age');
    $year = gmdate('Y');
    $filename = ($name ?: 'fertility-report') . '-' . ($age ?: 'age') . '-' . $year . '-' . wp_generate_password(6, false, false) . '.pdf';
    $path = trailingslashit($dir) . $filename;

    $pdf = fertility_check_build_simple_pdf($payload);
    if (!$pdf || file_put_contents($path, $pdf) === false) {
        return '';
    }

    return $path;
}

function fertility_check_report_url_from_path($path) {
    $upload = wp_upload_dir();
    if (empty($upload['basedir']) || empty($upload['baseurl'])) {
        return '';
    }

    $relative = str_replace(wp_normalize_path($upload['basedir']), '', wp_normalize_path($path));
    return trailingslashit($upload['baseurl']) . ltrim($relative, '/');
}

function fertility_check_build_simple_pdf($payload) {
    $name = sanitize_text_field($payload['name'] ?? $payload['userName'] ?? '');
    $age = sanitize_text_field($payload['age'] ?? '');
    $sex = sanitize_text_field($payload['sex'] ?? '');
    $phone = sanitize_text_field($payload['phone'] ?? $payload['mobile'] ?? '');
    $risk = strtoupper(sanitize_text_field($payload['risk_category'] ?? ''));
    $urgency = sanitize_text_field($payload['referral_urgency'] ?? '');
    $red = intval($payload['red_count'] ?? 0);
    $amber = intval($payload['amber_count'] ?? 0);
    $ovarian = fertility_check_ovarian_reserve_label($payload['ovarian_reserve'] ?? null);
    $flagged = is_array($payload['flagged_factors'] ?? null) ? $payload['flagged_factors'] : array();
    $triggers = is_array($payload['referral_triggers'] ?? null) ? $payload['referral_triggers'] : array();

    $lines = array(
        array('type' => 'title', 'text' => 'SORA Fertility Awareness Report'),
        array('type' => 'small', 'text' => 'Evidence-aligned risk summary for clinician discussion'),
        array('type' => 'space'),
        array('type' => 'row', 'label' => 'Name', 'text' => $name),
        array('type' => 'row', 'label' => 'Age', 'text' => $age),
        array('type' => 'row', 'label' => 'Sex', 'text' => $sex),
        array('type' => 'row', 'label' => 'Mobile', 'text' => $phone),
        array('type' => 'row', 'label' => 'Overall Risk', 'text' => $risk),
        array('type' => 'row', 'label' => 'Referral Urgency', 'text' => $urgency),
        array('type' => 'row', 'label' => 'Red / Amber', 'text' => $red . ' red, ' . $amber . ' amber'),
    );

    if ($ovarian) {
        $lines[] = array('type' => 'row', 'label' => 'Ovarian Reserve', 'text' => $ovarian);
    }

    if (!empty($triggers)) {
        $lines[] = array('type' => 'space');
        $lines[] = array('type' => 'heading', 'text' => 'Clinical Referral Triggers');
        foreach ($triggers as $trigger) {
            $lines[] = array('type' => 'bullet', 'text' => sanitize_text_field($trigger));
        }
    }

    $lines[] = array('type' => 'space');
    $lines[] = array('type' => 'heading', 'text' => 'Flagged Factors');
    if (!empty($flagged)) {
        foreach ($flagged as $factor) {
            $title = sanitize_text_field($factor['title'] ?? '');
            $label = sanitize_text_field($factor['label'] ?? '');
            $level = sanitize_text_field($factor['level'] ?? '');
            $lines[] = array('type' => 'factor', 'level' => $level, 'text' => trim($title . ': ' . $label));
        }
    } else {
        $lines[] = array('type' => 'small', 'text' => 'No red or amber factors were identified from the answers provided.');
    }

    $lines[] = array('type' => 'space');
    $lines[] = array('type' => 'heading', 'text' => 'Suggested Discussion Points');
    $lines[] = array('type' => 'bullet', 'text' => 'Review cycle pattern, ovulation history, and age-specific referral timing.');
    $lines[] = array('type' => 'bullet', 'text' => 'Consider semen analysis when a sperm-contributing partner is involved.');
    $lines[] = array('type' => 'bullet', 'text' => 'Discuss whether tubal, uterine, endocrine, or ovarian reserve testing is appropriate.');
    $lines[] = array('type' => 'space');
    $lines[] = array('type' => 'small', 'text' => 'Scientific basis: FertiSTAT and AAFA/AFA ovarian reserve research. This report is educational and is not a diagnosis, treatment plan, or pregnancy prediction.');

    return fertility_check_pdf_from_lines($lines, $risk);
}

function fertility_check_pdf_from_lines($lines, $risk) {
    $objects = array();
    $pages = array();
    $current = fertility_check_pdf_new_page($risk);

    foreach ($lines as $line) {
        $wrapped = fertility_check_pdf_wrap_line($line);
        foreach ($wrapped as $wrapped_line) {
            if ($current['y'] < 70) {
                $pages[] = $current;
                $current = fertility_check_pdf_new_page($risk);
            }
            fertility_check_pdf_add_line($current, $wrapped_line);
        }
    }
    $pages[] = $current;

    $catalog_id = 1;
    $pages_id = 2;
    $font_regular_id = 3;
    $font_bold_id = 4;
    $next_id = 5;
    $page_refs = array();

    foreach ($pages as $page) {
        $page_id = $next_id++;
        $content_id = $next_id++;
        $page_refs[] = $page_id . ' 0 R';
        $objects[$page_id] = "<< /Type /Page /Parent $pages_id 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 $font_regular_id 0 R /F2 $font_bold_id 0 R >> >> /Contents $content_id 0 R >>";
        $stream = implode("\n", $page['ops']);
        $objects[$content_id] = "<< /Length " . strlen($stream) . " >>\nstream\n" . $stream . "\nendstream";
    }

    $objects[$catalog_id] = "<< /Type /Catalog /Pages $pages_id 0 R >>";
    $objects[$pages_id] = "<< /Type /Pages /Kids [" . implode(' ', $page_refs) . "] /Count " . count($page_refs) . " >>";
    $objects[$font_regular_id] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    $objects[$font_bold_id] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
    ksort($objects);

    $pdf = "%PDF-1.4\n";
    $offsets = array(0);
    foreach ($objects as $id => $object) {
        $offsets[$id] = strlen($pdf);
        $pdf .= $id . " 0 obj\n" . $object . "\nendobj\n";
    }

    $xref = strlen($pdf);
    $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
    $pdf .= "0000000000 65535 f \n";
    for ($i = 1; $i <= count($objects); $i++) {
        $pdf .= sprintf("%010d 00000 n \n", $offsets[$i]);
    }
    $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root $catalog_id 0 R >>\nstartxref\n$xref\n%%EOF";

    return $pdf;
}

function fertility_check_pdf_new_page($risk) {
    $color = $risk === 'HIGH' ? '0.663 0.247 0.247' : ($risk === 'MEDIUM' ? '0.827 0.604 0.153' : '0.333 0.482 0.365');
    return array(
        'y' => 800,
        'ops' => array(
            '0.141 0.192 0.239 rg 0 790 595 52 re f',
            '1 1 1 rg BT /F2 18 Tf 40 812 Td (SORA Fertility) Tj ET',
            $color . ' rg 430 804 120 24 re f',
        ),
    );
}

function fertility_check_pdf_wrap_line($line) {
    if (($line['type'] ?? '') === 'space') {
        return array($line);
    }

    $text = $line['text'] ?? '';
    if (($line['type'] ?? '') === 'row') {
        $text = ($line['label'] ?? '') . ': ' . $text;
    }

    $max = (($line['type'] ?? '') === 'title') ? 56 : 88;
    $wrapped = wordwrap($text, $max, "\n", true);
    $parts = explode("\n", $wrapped);
    $out = array();
    foreach ($parts as $index => $part) {
        $copy = $line;
        $copy['text'] = $part;
        if (($line['type'] ?? '') === 'row') {
            $copy['label'] = $index === 0 ? ($line['label'] ?? '') : '';
        }
        $out[] = $copy;
    }
    return $out;
}

function fertility_check_pdf_add_line(&$page, $line) {
    $type = $line['type'] ?? 'small';
    if ($type === 'space') {
        $page['y'] -= 12;
        return;
    }

    $text = fertility_check_pdf_text($line['text'] ?? '');
    $x = 40;
    $font = '/F1';
    $size = 10;
    $leading = 16;
    $color = '0.141 0.192 0.239';

    if ($type === 'title') {
        $font = '/F2'; $size = 22; $leading = 30;
    } elseif ($type === 'heading') {
        $font = '/F2'; $size = 14; $leading = 22;
    } elseif ($type === 'row') {
        $font = '/F2'; $size = 10; $leading = 17;
    } elseif ($type === 'bullet') {
        $text = fertility_check_pdf_text('- ' . ($line['text'] ?? ''));
        $x = 52;
    } elseif ($type === 'factor') {
        $level = $line['level'] ?? '';
        $color = $level === 'red' ? '0.663 0.247 0.247' : '0.827 0.604 0.153';
        $page['ops'][] = $color . ' rg 40 ' . ($page['y'] - 4) . ' 4 14 re f';
        $x = 52;
    }

    $page['ops'][] = $color . " rg BT $font $size Tf $x " . $page['y'] . " Td ($text) Tj ET";
    $page['y'] -= $leading;
}

function fertility_check_pdf_text($text) {
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', (string) $text);
    $text = str_replace(array('\\', '(', ')'), array('\\\\', '\\(', '\\)'), $text);
    return $text;
}

function fertility_check_admin_menu() {
    add_menu_page(
        'SORA Fertility Reports',
        'SORA Fertility',
        'manage_options',
        'fertility-check-reports',
        'fertility_check_render_admin_reports',
        'dashicons-heart',
        26
    );

    add_submenu_page(
        'fertility-check-reports',
        'SORA Fertility Settings',
        'Settings',
        'manage_options',
        'fertility-check-settings',
        'fertility_check_render_settings'
    );
}
add_action('admin_menu', 'fertility_check_admin_menu');

function fertility_check_render_settings() {
    if (!current_user_can('manage_options')) {
        return;
    }

    echo '<div class="wrap"><h1>SORA Fertility Settings</h1>';
    echo '<form method="post" action="options.php">';
    settings_fields('fertility_check_settings');
    echo '<table class="form-table" role="presentation"><tbody>';
    echo '<tr><th scope="row"><label for="fertility_check_clinic_id">Clinic ID</label></th><td>';
    echo '<input name="fertility_check_clinic_id" id="fertility_check_clinic_id" type="text" class="regular-text" value="' . esc_attr(get_option('fertility_check_clinic_id', '')) . '">';
    echo '<p class="description">Public clinic identifier issued by SORA. It is not a secret.</p>';
    echo '</td></tr>';
    echo '<tr><th scope="row"><label for="fertility_check_assessment_api_url">Assessment API URL</label></th><td>';
    echo '<input name="fertility_check_assessment_api_url" id="fertility_check_assessment_api_url" type="url" class="regular-text code" value="' . esc_attr(get_option('fertility_check_assessment_api_url', FERTILITY_CHECK_DEFAULT_API_URL)) . '">';
    echo '<p class="description">The private scoring endpoint. The widget sends answers here and receives the calculated result.</p>';
    echo '</td></tr>';
    echo '</tbody></table>';
    submit_button();
    echo '</form></div>';
}

function fertility_check_render_admin_reports() {
    if (!current_user_can('manage_options')) {
        return;
    }

    fertility_check_activate();

    global $wpdb;
    $table_name = $wpdb->prefix . 'fertility_check_reports';
    $reports = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 100");

    echo '<div class="wrap"><h1>SORA Fertility Reports</h1>';
    echo '<p>Latest saved SORA Fertility report requests, including risk category and referral urgency.</p>';
    echo '<table class="widefat fixed striped"><thead><tr>';
    echo '<th>Date</th><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Sex</th><th>Risk</th><th>Referral Urgency</th><th>Red/Amber</th><th>Report</th>';
    echo '</tr></thead><tbody>';

    if (empty($reports)) {
        echo '<tr><td colspan="10">No reports saved yet.</td></tr>';
    } else {
        foreach ($reports as $report) {
            echo '<tr>';
            echo '<td>' . esc_html($report->created_at) . '</td>';
            echo '<td>' . esc_html($report->name) . '</td>';
            echo '<td><a href="mailto:' . esc_attr($report->email) . '">' . esc_html($report->email) . '</a></td>';
            echo '<td>' . esc_html($report->phone) . '</td>';
            echo '<td>' . esc_html($report->age) . '</td>';
            echo '<td>' . esc_html($report->sex) . '</td>';
            echo '<td><strong>' . esc_html(strtoupper($report->risk_category)) . '</strong></td>';
            echo '<td>' . esc_html($report->referral_urgency) . '</td>';
            echo '<td>' . intval($report->red_count) . ' / ' . intval($report->amber_count) . '</td>';
            if (!empty($report->report_url)) {
                echo '<td><a href="' . esc_url($report->report_url) . '" target="_blank" rel="noopener">PDF</a></td>';
            } else {
                echo '<td>-</td>';
            }
            echo '</tr>';
        }
    }

    echo '</tbody></table></div>';
}
