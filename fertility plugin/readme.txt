=== SORA Fertility ===
Contributors: sora
Tags: fertility, health, risk assessment, widget, shortcode
Requires at least: 5.0
Tested up to: 6.5
Stable tag: 1.2.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

An evidence-aligned SORA Fertility risk awareness widget using FertiSTAT-style colour bands and optional AAFA ovarian reserve classification.

== Description ==
Add the interactive SORA Fertility tool to any page using the [fertility_check] shortcode or the "SORA Fertility" Gutenberg block.

Features:
- 27 risk/context questions covering age, BMI, reproductive history, cycle pattern, TB history, partner sperm context, medical factors, and lifestyle factors.
- Colour-band classification: green, amber, and red, calculated by the configured private SORA assessment API.
- Overall risk category based on immediate referral triggers plus an internal weighted triage model that is not shipped in the browser widget.
- Optional AMH, FSH, and AFC lab entry for separate AAFA ovarian reserve cluster reporting.
- No numerical fertility score is shown.
- Consultation lead capture remains consent-based and separate from report generation.

Scientific basis:
- FertiSTAT: Bunting L, Boivin J. Human Reproduction. 2010;25(7):1722-1733.
- AAFA/AFA: Xu H, et al. J Assist Reprod Genet. 2020;37(4):963-972.

== Installation ==
1. Upload the fertility-check folder to the /wp-content/plugins/ directory.
2. Activate the plugin.
3. Use the shortcode [fertility_check] or insert the SORA Fertility block.
4. Open SORA Fertility > Settings and enter the SORA Clinic ID and Assessment API URL issued for the clinic.

== Changelog ==
= 1.2.0 =
* Moved fertility scoring and ovarian reserve classification out of the public widget bundle.
* Added a configurable private assessment API URL and public Clinic ID setting.
* Updated the widget to request server-side assessment results before rendering reports.

= 1.1.0 =
* Replaced the old 0-100 scoring model with colour-band risk classification.
* Added all 17 specified risk factors.
* Added clinical referral triggers and a weighted internal triage model.
* Added clinical context questions for partner sperm factor, pregnancy losses, ectopic pregnancy, cycle length, pelvic pain, uterine history, intercourse timing, and current fertility goal.
* Added AAFA ovarian reserve cluster output as a separate report line.
* Restored the WordPress plugin loader and cleaned the Gutenberg block preview.

= 1.0.0 =
* Initial release.
