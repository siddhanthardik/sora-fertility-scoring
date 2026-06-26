import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

/**
 * Returns the SORA logo as a Buffer.
 * Priority: 1) local /public/sora-logo.png  2) remote URL
 */
async function getSoraLogoBuffer() {
  try {
    const localPath = path.join(process.cwd(), 'public', 'sora-logo.png');
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  } catch {
    // fall through to remote
  }
  return fetchImageBuffer('https://sorafertility.com/sora-logo.png');
}

export async function generateAssessmentPDF(patientInfo, assessment, options = {}) {
  const { type = 'basic', whiteLabel = false, clinicLogo = null, clinicName = "SORA Fertility Network" } = options;

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Colors
      const colors = {
        primary: '#E83E8C',
        secondary: '#6F42C1',
        accent: '#20C997',
        background: '#FFF0F5',
        textDark: '#333333',
        textLight: '#666666',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444'
      };

      let logoBuffer = null;
      if (clinicLogo) {
        logoBuffer = await fetchImageBuffer(clinicLogo);
      }

      // --- HEADER ---
      if (type === 'premium') {
        doc.rect(0, 0, doc.page.width, 120).fill(colors.background);
        if (!whiteLabel) {
          try {
            const soraLogoBuffer = await getSoraLogoBuffer();
            if (soraLogoBuffer) {
              doc.image(soraLogoBuffer, (doc.page.width - 160) / 2, 20, { width: 160 });
            } else {
              doc.fillColor(colors.primary).fontSize(28).text('SORA Fertility Network', 50, 40, { align: 'center' });
            }
          } catch(e) {
            doc.fillColor(colors.primary).fontSize(28).text('SORA Fertility Network', 50, 40, { align: 'center' });
          }
        } else {
          doc.fillColor(colors.primary).fontSize(28).text(clinicName, 50, 40, { align: 'center' });
        }
        doc.fontSize(14).fillColor(colors.secondary).text('Comprehensive FertiSTAT Assessment', 50, 80, { align: 'center' });
        doc.moveDown(3);
      } else {
        doc.moveDown(1);
        if (logoBuffer) {
           doc.image(logoBuffer, 50, 40, { width: 150 });
           doc.moveDown(2);
        } else {
           if (!whiteLabel) {
             const soraLogoBuffer = await getSoraLogoBuffer();
             if (soraLogoBuffer) {
               doc.image(soraLogoBuffer, 50, 40, { width: 150 });
               doc.moveDown(2);
             } else {
               doc.fillColor('#000000').fontSize(24).text('SORA Fertility Network', { align: 'center' });
             }
           } else {
             doc.fillColor('#000000').fontSize(24).text(clinicName, { align: 'center' });
           }
        }
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('#666666').text('FertiSTAT Assessment Report', { align: 'center' });
        doc.moveDown(2);
      }

      const startY = doc.y;

      // --- PATIENT INFO ---
      doc.fontSize(16).fillColor(type === 'premium' ? colors.primary : '#000000').text('Patient Information');
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor(colors.textDark);
      doc.text(`Name: ${patientInfo.name || 'Not Provided'}`);
      doc.text(`Email: ${patientInfo.email || 'Not Provided'}`);
      doc.text(`Phone: ${patientInfo.phone || 'Not Provided'}`);
      doc.text(`Age: ${patientInfo.age || 'Not Provided'}`);
      doc.moveDown(2);

      // --- ASSESSMENT RESULTS ---
      doc.fontSize(16).fillColor(type === 'premium' ? colors.primary : '#000000').text('Assessment Results');
      doc.moveDown(0.5);
      
      let riskColor = colors.green;
      if (assessment.category === 'medium') riskColor = colors.amber;
      if (assessment.category === 'high') riskColor = colors.red;

      if (type === 'premium') {
        doc.roundedRect(50, doc.y, doc.page.width - 100, 80, 10).fillOpacity(0.1).fill(riskColor);
        doc.fillOpacity(1);
        doc.fontSize(20).fillColor(riskColor).text(`Risk Band: ${assessment.category.toUpperCase()}`, 70, doc.y - 65);
        doc.fontSize(12).fillColor(colors.textDark).text(assessment.detailedMeaning, 70, doc.y + 5, { width: doc.page.width - 140 });
        doc.moveDown(2);
        doc.x = 50;
      } else {
        doc.fontSize(18).fillColor(riskColor).text(`Risk Band: ${assessment.category.toUpperCase()}`);
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor(colors.textDark).text(assessment.detailedMeaning);
        doc.moveDown();
      }

      doc.fontSize(13).fillColor(colors.textDark).text(`Recommendation: `, { continued: true }).fillColor(riskColor).text(assessment.recommendation);
      doc.moveDown(2);

      // --- FLAGGED FACTORS ---
      if (assessment.flaggedFactors && assessment.flaggedFactors.length > 0) {
        doc.fontSize(16).fillColor(type === 'premium' ? colors.primary : '#000000').text('Flagged Factors');
        doc.moveDown(0.5);
        
        assessment.flaggedFactors.forEach(factor => {
          const factorColor = factor.level === 'red' ? colors.red : colors.amber;
          
          if (type === 'premium') {
            const currentY = doc.y;
            doc.roundedRect(50, currentY, doc.page.width - 100, 50, 5).fillOpacity(0.05).fill(factorColor);
            doc.fillOpacity(1);
            doc.fontSize(12).fillColor(factorColor).text(`• ${factor.title} (${factor.level.toUpperCase()})`, 60, currentY + 10);
            doc.fontSize(10).fillColor(colors.textLight).text(`  ${factor.detail}`, 60, currentY + 25);
            doc.y = currentY + 60;
            doc.x = 50;
          } else {
            doc.fontSize(12).fillColor(factorColor).text(`• ${factor.title} (${factor.level.toUpperCase()})`);
            doc.fontSize(10).fillColor(colors.textLight).text(`  ${factor.detail}`);
            doc.moveDown(0.5);
          }
        });
        doc.moveDown(1);
      }

      // --- PREMIUM EXCLUSIVES ---
      if (type === 'premium') {
        doc.addPage();
        
        doc.fontSize(20).fillColor(colors.secondary).text('Your Next Steps & Action Plan', { align: 'center' });
        doc.moveDown(1.5);

        const actions = [
          "Schedule a consultation with a fertility specialist.",
          "Consider tracking your basal body temperature and cervical mucus.",
          "Maintain a balanced diet rich in antioxidants.",
          "Discuss any flagged factors in this report with your healthcare provider."
        ];

        let actionY = doc.y;
        actions.forEach((action, i) => {
          doc.circle(70, actionY + 5, 15).fill(colors.primary);
          doc.fillColor('#FFFFFF').fontSize(12).text((i + 1).toString(), 66, actionY);
          doc.fillColor(colors.textDark).text(action, 100, actionY);
          actionY += 40;
        });
        doc.y = actionY;
      }

      // --- TRIGGERS ---
      if (assessment.referralTriggers && assessment.referralTriggers.length > 0) {
        if (type !== 'premium') doc.addPage();
        doc.fontSize(16).fillColor(type === 'premium' ? colors.primary : '#000000').text('Referral Triggers');
        doc.moveDown(0.5);
        
        assessment.referralTriggers.forEach(trigger => {
          doc.fontSize(12).fillColor(colors.red).text(`• ${trigger}`);
          doc.moveDown(0.5);
        });
      }

      // --- PATIENT RESPONSES ---
      if (type === 'premium') {
        doc.addPage();
        doc.fontSize(20).fillColor(colors.secondary).text('Your Complete Questionnaire Responses', { align: 'center' });
        doc.moveDown(1.5);
        
        doc.fontSize(10).fillColor(colors.textDark);
        if (assessment.rawPayload) {
          const excludedKeys = ['reportType', 'paymentStatus', 'razorpayOrderId', 'name', 'email', 'phone'];
          for (const [key, value] of Object.entries(assessment.rawPayload)) {
             if (excludedKeys.includes(key) || value === '' || value === null) continue;
             const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
             doc.font('Helvetica-Bold').text(`${formattedKey}: `, { continued: true })
                .font('Helvetica').text(`${value}`);
             doc.moveDown(0.5);
          }
        } else {
          doc.text('No questionnaire data provided.');
        }
        doc.moveDown(2);
      }

      // --- FOOTER ---
      const bottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      
      let footerText = 'This report is intended for clinical context, not as a standalone diagnosis.';
      if (!whiteLabel) {
        footerText = 'This report is generated by SORA Fertility Network and is intended for clinical context, not as a standalone diagnosis.';
      }

      doc.fontSize(10).text(
        footerText,
        50,
        doc.page.height - 50,
        {
          lineBreak: false,
          align: 'center',
          color: colors.textLight
        }
      );
      doc.page.margins.bottom = bottom;

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function generatePregnancyTimelinePDF(results, insights = {}, options = {}) {
  const { clinicName = "SORA Fertility Network" } = options;

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const colors = {
        primary: '#E11D48',    // rose-600 – matches the on-screen UI
        secondary: '#6F42C1',
        background: '#FFF1F2', // rose-50
        cardBg: '#f8fafc',
        highlight: '#fff1f2',
        textDark: '#0F172A',   // slate-900
        textMid: '#334155',    // slate-700
        textLight: '#64748B',  // slate-500
        accent: '#F43F5E',
        border: '#E2E8F0',
      };

      const pageW = doc.page.width;
      const margin = 50;
      const contentW = pageW - margin * 2;

      const renderPageFooter = (pageNum) => {
        const prev = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fontSize(8)
          .fillColor(colors.textLight)
          .text(
            `SORA Pregnancy Timeline  •  Page ${pageNum}  •  sorafertility.com`,
            margin,
            doc.page.height - 32,
            { align: 'center', width: contentW }
          );
        doc.page.margins.bottom = prev;
      };

      // ──────────────────────────────────────────────────────────────────
      // PAGE 1 — Pregnancy Snapshot (matches on-screen "Hero Snapshot")
      // ──────────────────────────────────────────────────────────────────

      // Pink header band
      doc.rect(0, 0, pageW, 150).fill(colors.background);

      // SORA Logo (local first, remote fallback)
      const soraLogoBuffer = await getSoraLogoBuffer();
      if (soraLogoBuffer) {
        doc.image(soraLogoBuffer, (pageW - 140) / 2, 18, { width: 140 });
      } else {
        doc.fillColor(colors.primary).fontSize(22)
           .font('Helvetica-Bold')
           .text('SORA Fertility', margin, 38, { align: 'center', width: contentW });
      }
      doc.fontSize(11).fillColor(colors.secondary)
         .font('Helvetica')
         .text('Pregnancy Snapshot & Due Date Report', margin, 108, { align: 'center', width: contentW });

      // ── Due Date hero ──
      const ddY = 170;
      doc.fontSize(10).fillColor(colors.textLight).font('Helvetica')
         .text('ESTIMATED DUE DATE', margin, ddY, { align: 'center', width: contentW, characterSpacing: 1 });
      doc.fontSize(34).fillColor(colors.primary).font('Helvetica-Bold')
         .text(results.dueDateShort || results.dueDate, margin, ddY + 18, { align: 'center', width: contentW });

      // ── 4-card grid: Gestational Age | Trimester | Days Left | Arrival Window ──
      const cardY = 255;
      const cardH = 68;
      const colW = (contentW - 15) / 2;
      const col2X = margin + colW + 15;

      const drawCard = (x, y, w, label, value, sub = null) => {
        doc.roundedRect(x, y, w, cardH, 8).fill(colors.cardBg);
        doc.fontSize(8).fillColor(colors.textLight).font('Helvetica')
           .text(label.toUpperCase(), x + 14, y + 12, { characterSpacing: 0.5, width: w - 28 });
        doc.fontSize(15).fillColor(colors.textDark).font('Helvetica-Bold')
           .text(value, x + 14, y + 28, { width: w - 28 });
        if (sub) {
          doc.fontSize(9).fillColor(colors.textLight).font('Helvetica')
             .text(sub, x + 14, y + 50, { width: w - 28 });
        }
      };

      drawCard(margin, cardY, colW, 'Gestational Age', results.gestationalAge, results.trimester);
      drawCard(col2X, cardY, colW, 'Conception Method', results.method || 'Natural Pregnancy');

      const row2Y = cardY + cardH + 12;
      const daysLeft = results.daysUntilDue > 0 ? results.daysUntilDue : 0;
      const weeksLeft = results.weeksLeft > 0 ? results.weeksLeft : 0;
      const monthsLeft = results.monthsLeft > 0 ? results.monthsLeft : 0;
      drawCard(margin, row2Y, colW, 'Days Remaining', `${daysLeft} days`, `${weeksLeft} weeks • ${monthsLeft} months`);
      drawCard(col2X, row2Y, colW, 'Arrival Window', results.arrivalWindow || '—', 'Between 37–42 weeks');

      // ── Baby Development card (full width) ──
      const babyY = row2Y + cardH + 12;
      const babyH = 90;
      doc.roundedRect(margin, babyY, contentW, babyH, 8).fill(colors.cardBg);
      doc.fontSize(8).fillColor(colors.textLight).font('Helvetica')
         .text('BABY DEVELOPMENT THIS WEEK', margin + 14, babyY + 12, { characterSpacing: 0.5 });

      // Size row
      const sizeText = insights.size
        ? `Size of ${insights.size.charAt(0).toUpperCase() + insights.size.slice(1)}`
        : 'Growing quickly!';
      doc.fontSize(14).fillColor(colors.primary).font('Helvetica-Bold')
         .text(sizeText, margin + 14, babyY + 28);

      // Clinical size (length/weight) — the key missing field
      if (insights.clinicalSize && insights.clinicalSize.trim()) {
        doc.fontSize(10).fillColor(colors.textMid).font('Helvetica')
           .text(insights.clinicalSize, margin + 14, babyY + 48);
      }

      // Tagline
      if (insights.tagline) {
        doc.fontSize(10).fillColor(colors.textLight).font('Helvetica-Oblique')
           .text(insights.tagline, margin + 14, babyY + 64, { width: contentW - 28 });
      }

      // ── Trimester dates ──
      const trimY = babyY + babyH + 14;
      const triW = (contentW - 10) / 3;
      const triItems = [
        { label: '1st Trimester starts', value: 'Week 1' },
        { label: '2nd Trimester starts', value: results.trimester1 || '—' },
        { label: '3rd Trimester starts', value: results.trimester2 || '—' },
      ];
      triItems.forEach((item, i) => {
        const tx = margin + i * (triW + 5);
        doc.roundedRect(tx, trimY, triW, 52, 6).fill('#F1F5F9');
        doc.fontSize(8).fillColor(colors.textLight).font('Helvetica')
           .text(item.label.toUpperCase(), tx + 10, trimY + 10, { characterSpacing: 0.3, width: triW - 20 });
        doc.fontSize(11).fillColor(colors.textDark).font('Helvetica-Bold')
           .text(item.value, tx + 10, trimY + 26, { width: triW - 20 });
      });

      renderPageFooter(1);

      // ──────────────────────────────────────────────────────────────────
      // PAGE 2 — Milestones & Next Scan (matches on-screen "Journey" section)
      // ──────────────────────────────────────────────────────────────────
      doc.addPage();

      doc.fontSize(20).fillColor(colors.textDark).font('Helvetica-Bold')
         .text('Pregnancy Journey & Milestones', margin, margin, { align: 'center', width: contentW });

      // ── Horizontal timeline ──
      const tlY = 110;
      const tlLeft = margin + 20;
      const tlRight = pageW - margin - 20;
      const tlWidth = tlRight - tlLeft;
      const milestonePoints = [
        { w: 4,  label: '4w',  date: results.timeline?.w4 },
        { w: 12, label: '12w', date: results.timeline?.w12 },
        { w: 20, label: '20w', date: results.timeline?.w20 },
        { w: 28, label: '28w', date: results.timeline?.w28 },
        { w: 40, label: '40w', date: results.timeline?.w40 },
      ];

      // Track line (grey full, rose filled for progress)
      doc.rect(tlLeft, tlY, tlWidth, 3).fill('#E2E8F0');
      const progressPct = Math.min((results.currentWeeks || 0) / 40, 1);
      if (progressPct > 0) {
        doc.rect(tlLeft, tlY, tlWidth * progressPct, 3).fill(colors.primary);
      }

      milestonePoints.forEach((m, i) => {
        const mx = tlLeft + (i / 4) * tlWidth;
        const isPast = (results.currentWeeks || 0) >= m.w;
        const isCurrent = Math.abs((results.currentWeeks || 0) - m.w) <= 4 && isPast;

        // Dot
        doc.circle(mx, tlY + 1.5, 7)
           .lineWidth(2)
           .fillAndStroke(isPast ? colors.primary : '#FFFFFF', isPast ? colors.primary : '#CBD5E1');

        // "You are here" badge for current node
        if (isCurrent) {
          doc.roundedRect(mx - 22, tlY - 24, 44, 16, 4).fill(colors.textDark);
          doc.fontSize(7).fillColor('#FFFFFF').font('Helvetica-Bold')
             .text('YOU ARE HERE', mx - 20, tlY - 21, { width: 40, align: 'center' });
        }

        // Label below
        doc.fontSize(9).fillColor(isPast ? colors.textDark : colors.textLight).font('Helvetica-Bold')
           .text(m.label, mx - 15, tlY + 16, { width: 30, align: 'center' });
        doc.fontSize(8).fillColor(colors.textLight).font('Helvetica')
           .text(m.date || '', mx - 18, tlY + 30, { width: 36, align: 'center' });
      });

      // ── Next Milestone card ──
      if (results.nextMilestone) {
        const nmY = tlY + 75;
        doc.roundedRect(margin, nmY, contentW, 62, 8).fill('#FFF1F2');
        doc.rect(margin, nmY, 4, 62).fill(colors.primary);
        doc.fontSize(8).fillColor(colors.textLight).font('Helvetica')
           .text('COMING UP NEXT', margin + 16, nmY + 12, { characterSpacing: 0.5 });
        doc.fontSize(14).fillColor(colors.primary).font('Helvetica-Bold')
           .text(results.nextMilestone.name, margin + 16, nmY + 26);
        doc.fontSize(9).fillColor(colors.textMid).font('Helvetica')
           .text(`${results.nextMilestone.desc}  •  ${results.nextMilestone.time}`, margin + 16, nmY + 46, { width: contentW - 130 });
      }

      // ── Recommended Clinical Scans ──
      const scansY = (results.nextMilestone ? tlY + 75 + 62 : tlY + 60) + 24;
      doc.fontSize(14).fillColor(colors.textDark).font('Helvetica-Bold')
         .text('Recommended Clinical Scans & Tests', margin, scansY);

      const tests = [
        { weeks: '11–14 weeks', name: 'NT Scan & NIPT screening' },
        { weeks: '18–22 weeks', name: 'Anomaly Scan (anatomy ultrasound)' },
        { weeks: '24–28 weeks', name: 'Gestational Diabetes Screening' },
        { weeks: '32 weeks',    name: 'Growth Scan (if indicated)' },
        { weeks: '35–37 weeks', name: 'Group B Strep Test (risk-based)' },
      ];

      let scanY = scansY + 26;
      tests.forEach(test => {
        doc.roundedRect(margin, scanY, contentW, 34, 5).fill(colors.cardBg);
        doc.fontSize(10).fillColor(colors.primary).font('Helvetica-Bold')
           .text(test.weeks, margin + 14, scanY + 11, { width: 100 });
        doc.fontSize(10).fillColor(colors.textMid).font('Helvetica')
           .text(test.name, margin + 125, scanY + 11, { width: contentW - 135 });
        scanY += 39;
      });

      renderPageFooter(2);

      // ──────────────────────────────────────────────────────────────────
      // PAGE 3 — Baby Development (matches on-screen "Insights" section)
      // ──────────────────────────────────────────────────────────────────
      doc.addPage();

      doc.fontSize(20).fillColor(colors.textDark).font('Helvetica-Bold')
         .text(`Baby Development — Week ${results.currentWeeks || '?'}`, margin, margin, { align: 'center', width: contentW });

      let p3Y = margin + 38;

      // Size + tagline hero
      doc.roundedRect(margin, p3Y, contentW, 72, 8).fill(colors.background);
      const heroSizeText = insights.size
        ? `Your baby is the size of ${insights.size}`
        : 'Your baby is growing quickly!';
      doc.fontSize(16).fillColor(colors.primary).font('Helvetica-Bold')
         .text(heroSizeText, margin + 16, p3Y + 14, { width: contentW - 32 });

      if (insights.clinicalSize && insights.clinicalSize.trim()) {
        doc.fontSize(11).fillColor(colors.textMid).font('Helvetica')
           .text(insights.clinicalSize, margin + 16, p3Y + 36, { width: contentW - 32 });
      }
      if (insights.tagline) {
        doc.fontSize(10).fillColor(colors.secondary).font('Helvetica-Oblique')
           .text(insights.tagline, margin + 16, p3Y + 55, { width: contentW - 32 });
      }
      p3Y += 84;

      // What's happening this week
      doc.fontSize(13).fillColor(colors.textDark).font('Helvetica-Bold')
         .text("What's happening this week:", margin, p3Y);
      p3Y += 22;

      if (insights.what && Array.isArray(insights.what)) {
        insights.what.forEach(item => {
          doc.roundedRect(margin, p3Y, contentW, 32, 5).fill(colors.cardBg);
          doc.fontSize(10).fillColor(colors.textMid).font('Helvetica')
             .text(`•  ${item}`, margin + 14, p3Y + 10, { width: contentW - 28 });
          p3Y += 37;
        });
      }

      p3Y += 10;

      // Did you know
      doc.roundedRect(margin, p3Y, contentW, 72, 8).fill('#FFF1F2');
      doc.rect(margin, p3Y, 4, 72).fill(colors.primary);
      doc.fontSize(9).fillColor(colors.primary).font('Helvetica-Bold')
         .text('DID YOU KNOW?', margin + 16, p3Y + 12, { characterSpacing: 0.5 });
      doc.fontSize(11).fillColor(colors.textDark).font('Helvetica')
         .text(insights.didYouKnow || 'Every pregnancy is unique.', margin + 16, p3Y + 30, { width: contentW - 32 });
      p3Y += 82;

      // This week's tip
      doc.roundedRect(margin, p3Y, contentW, 72, 8).fill('#EEF2FF'); // indigo-50
      doc.rect(margin, p3Y, 4, 72).fill(colors.secondary);
      doc.fontSize(9).fillColor(colors.secondary).font('Helvetica-Bold')
         .text("THIS WEEK'S TIP", margin + 16, p3Y + 12, { characterSpacing: 0.5 });
      doc.fontSize(11).fillColor(colors.textDark).font('Helvetica')
         .text(insights.tip || 'Rest as much as possible and trust your body.', margin + 16, p3Y + 30, { width: contentW - 32 });
      p3Y += 82;

      // ── Medical Disclaimer band ──
      const prev = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      const discY = doc.page.height - 120;
      doc.rect(0, discY, pageW, 88).fill('#F8FAFC');
      doc.fontSize(9).fillColor(colors.textDark).font('Helvetica-Bold')
         .text('Medical Disclaimer', margin, discY + 12, { align: 'center', width: contentW });
      doc.fontSize(8.5).fillColor(colors.textLight).font('Helvetica')
         .text(
           'Only around 4–5% of babies arrive on their exact due date. Healthcare providers may adjust your due date based on ultrasound findings. ' +
           'Important: Please consult your medical practitioners or doctors for any clinical decisions. This data is purely for informational purposes, ' +
           'depends entirely on user input, and cannot be challenged in court.',
           margin + 20, discY + 30,
           { align: 'center', width: contentW - 40 }
         );
      doc.page.margins.bottom = prev;

      renderPageFooter(3);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
