import PDFDocument from 'pdfkit';

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
        primary: '#E83E8C', // Soft Pink/Magenta
        secondary: '#6F42C1', // Purple
        accent: '#20C997', // Teal
        background: '#FFF0F5', // Lavender Blush
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
        // Premium Colorful Header
        doc.rect(0, 0, doc.page.width, 120).fill(colors.background);
        if (!whiteLabel) {
          try {
            const soraLogoBuffer = await fetchImageBuffer("https://sora-fertility-scoring.vercel.app/sora-logo.png");
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
        // Basic Header
        doc.moveDown(1);
        if (logoBuffer) {
           doc.image(logoBuffer, 50, 40, { width: 150 });
           doc.moveDown(2);
        } else {
           if (!whiteLabel) {
             const soraLogoBuffer = await fetchImageBuffer("https://sora-fertility-scoring.vercel.app/sora-logo.png");
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
        // Draw a stylized Risk Band Card
        doc.roundedRect(50, doc.y, doc.page.width - 100, 80, 10).fillOpacity(0.1).fill(riskColor);
        doc.fillOpacity(1);
        doc.fontSize(20).fillColor(riskColor).text(`Risk Band: ${assessment.category.toUpperCase()}`, 70, doc.y - 65);
        doc.fontSize(12).fillColor(colors.textDark).text(assessment.detailedMeaning, 70, doc.y + 5, { width: doc.page.width - 140 });
        doc.moveDown(2);
        doc.x = 50; // reset x
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
        
        // Next Steps & Action Plan
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
        if (type !== 'premium') doc.addPage(); // Premium already added a page
        doc.fontSize(16).fillColor(type === 'premium' ? colors.primary : '#000000').text('Referral Triggers');
        doc.moveDown(0.5);
        
        assessment.referralTriggers.forEach(trigger => {
          doc.fontSize(12).fillColor(colors.red).text(`• ${trigger}`);
          doc.moveDown(0.5);
        });
      }

      // --- PATIENT RESPONSES (Added to bottom of premium report) ---
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
        primary: '#E83E8C',
        secondary: '#6F42C1',
        background: '#FFF0F5',
        textDark: '#333333',
        textLight: '#666666',
        cardBg: '#f8fafc',
        highlight: '#fff1f2'
      };

      const renderFooter = (pageNumber) => {
        const bottom = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc.fontSize(10).fillColor(colors.textLight).text(
          `Page ${pageNumber} • ${clinicName}`,
          50,
          doc.page.height - 40,
          { align: 'center', width: doc.page.width - 100 }
        );
        doc.page.margins.bottom = bottom;
      };

      // -------------------------------------------------------------
      // PAGE 1: Pregnancy Snapshot
      // -------------------------------------------------------------
      doc.rect(0, 0, doc.page.width, 140).fill(colors.background);
      if (clinicName === "SORA Fertility Network") {
        try {
          const soraLogoBuffer = await fetchImageBuffer("https://sora-fertility-scoring.vercel.app/sora-logo.png");
          if (soraLogoBuffer) {
            doc.image(soraLogoBuffer, (doc.page.width - 160) / 2, 20, { width: 160 });
          } else {
            doc.fillColor(colors.primary).fontSize(28).text(clinicName, 50, 40, { align: 'center', width: doc.page.width - 100 });
          }
        } catch(e) {
          doc.fillColor(colors.primary).fontSize(28).text(clinicName, 50, 40, { align: 'center', width: doc.page.width - 100 });
        }
      } else {
        doc.fillColor(colors.primary).fontSize(28).text(clinicName, 50, 40, { align: 'center', width: doc.page.width - 100 });
      }
      doc.fontSize(14).fillColor(colors.secondary).text('Pregnancy Snapshot & Due Date Report', 50, 80, { align: 'center', width: doc.page.width - 100 });

      doc.fontSize(14).fillColor(colors.textDark).text('Estimated Due Date', 50, 180, { align: 'center', width: doc.page.width - 100 });
      doc.fontSize(42).fillColor(colors.primary).text(results.dueDateShort || results.dueDate, 50, 205, { align: 'center', width: doc.page.width - 100 });

      // Info Cards Row 1
      let startY = 300;
      const boxWidth = (doc.page.width - 120) / 2;
      const x2 = 50 + boxWidth + 20;

      // Left Box
      doc.roundedRect(50, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('You Are Currently', 70, startY + 20);
      doc.fontSize(16).fillColor(colors.primary).text(results.gestationalAge, 70, startY + 45);

      // Right Box
      doc.roundedRect(x2, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('Conception Method', x2 + 20, startY + 20);
      doc.fontSize(16).fillColor(colors.textDark).text(results.method, x2 + 20, startY + 45, { width: boxWidth - 40 });

      // Info Cards Row 2
      startY = 400;

      // Left Box
      doc.roundedRect(50, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('Baby Size', 70, startY + 20);
      const sizeText = insights.size ? insights.size.charAt(0).toUpperCase() + insights.size.slice(1) : 'Growing quickly!';
      doc.fontSize(16).fillColor(colors.textDark).text(sizeText, 70, startY + 45);

      // Right Box
      doc.roundedRect(x2, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('Days Remaining', x2 + 20, startY + 20);
      doc.fontSize(16).fillColor(colors.textDark).text(`${results.daysUntilDue} days`, x2 + 20, startY + 45);
      
      renderFooter(1);

      // -------------------------------------------------------------
      // PAGE 2: Milestones
      // -------------------------------------------------------------
      doc.addPage();
      doc.fontSize(24).fillColor(colors.secondary).text('Pregnancy Journey & Milestones', 50, 50, { align: 'center', width: doc.page.width - 100 });

      const milestones = [
        { w: 4, label: '4 Weeks', date: results.timeline?.w4 },
        { w: 12, label: '12 Weeks', date: results.timeline?.w12 },
        { w: 20, label: '20 Weeks', date: results.timeline?.w20 },
        { w: 28, label: '28 Weeks', date: results.timeline?.w28 },
        { w: 40, label: '40 Weeks', date: results.timeline?.w40 }
      ];

      // Horizontal line visual
      const timelineY = 130;
      doc.rect(80, timelineY, doc.page.width - 160, 2).fillOpacity(1).fill(colors.textLight);
      
      let dotX = 80;
      const spacing = (doc.page.width - 160) / 4;

      milestones.forEach((m) => {
        const isPast = results.currentWeeks >= m.w;
        doc.circle(dotX, timelineY + 1, 6).fillOpacity(1).fill(isPast ? colors.primary : '#FFFFFF');
        doc.circle(dotX, timelineY + 1, 6).lineWidth(2).strokeOpacity(1).stroke(isPast ? colors.primary : '#CCCCCC');
        
        doc.fontSize(10).fillColor(colors.textDark).text(m.label, dotX - 25, timelineY + 20, { width: 50, align: 'center' });
        doc.fontSize(8).fillColor(colors.textLight).text(m.date || '', dotX - 25, timelineY + 35, { width: 50, align: 'center' });
        
        dotX += spacing;
      });

      // Upcoming Tests
      let tY = timelineY + 100;
      doc.fontSize(16).fillColor(colors.primary).text('Recommended Clinical Scans & Tests', 50, tY);
      
      tY += 30;
      const tests = [
        { weeks: '11–14 weeks', name: 'NT Scan & NIPT' },
        { weeks: '18–22 weeks', name: 'Anomaly Scan (Anatomy ultrasound)' },
        { weeks: '24–28 weeks', name: 'Gestational diabetes screening' },
        { weeks: '32 weeks', name: 'Growth Scan (If indicated)' },
        { weeks: '35–37 weeks', name: 'Group B Strep test' }
      ];

      tests.forEach(test => {
        doc.roundedRect(50, tY, doc.page.width - 100, 40, 5).fillOpacity(0.05).fill(colors.textDark);
        doc.fillOpacity(1);
        doc.fontSize(12).fillColor(colors.textDark).text(test.weeks, 70, tY + 14);
        doc.fillColor(colors.textLight).text(test.name, 180, tY + 14);
        tY += 45;
      });

      renderFooter(2);

      // -------------------------------------------------------------
      // PAGE 3: This Week's Insights
      // -------------------------------------------------------------
      doc.addPage();
      doc.fontSize(24).fillColor(colors.secondary).text(`Insights for Week ${results.currentWeeks}`, 50, 50, { align: 'center', width: doc.page.width - 100 });

      let p3Y = 120;
      doc.fontSize(18).fillColor(colors.primary).text(insights.tagline || 'Growing quickly!', 50, p3Y);
      p3Y += 40;

      // What's Happening
      doc.fontSize(14).fillColor(colors.textDark).text("What's happening right now:", 50, p3Y);
      p3Y += 25;
      
      if (insights.what && Array.isArray(insights.what)) {
        insights.what.forEach(item => {
          doc.fontSize(12).fillColor(colors.textLight).text(`• ${item}`, 60, p3Y, { width: doc.page.width - 110 });
          const textHeight = doc.heightOfString(`• ${item}`, { width: doc.page.width - 110 });
          p3Y += textHeight + 15;
        });
      }

      p3Y += 20;

      // Did You Know
      doc.roundedRect(50, p3Y, doc.page.width - 100, 80, 10).fillOpacity(0.05).fill(colors.primary);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.primary).text('Did you know?', 70, p3Y + 20);
      doc.fontSize(11).fillColor(colors.textDark).text(insights.didYouKnow || 'Every pregnancy is unique.', 70, p3Y + 40, { width: doc.page.width - 140 });

      p3Y += 100;

      // This Week's Tip
      doc.roundedRect(50, p3Y, doc.page.width - 100, 80, 10).fillOpacity(0.05).fill(colors.secondary);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.secondary).text("This Week's Tip", 70, p3Y + 20);
      doc.fontSize(11).fillColor(colors.textDark).text(insights.tip || 'Rest as much as possible and trust your body.', 70, p3Y + 40, { width: doc.page.width - 140 });

      // Disclaimer Footer (Fixed Absolute Positioning)
      const oldBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      const dY = doc.page.height - 120;
      doc.rect(0, dY, doc.page.width, 120).fill(colors.background);
      doc.fontSize(12).fillColor(colors.textDark).text('Medical Note', 50, dY + 30, { align: 'center', width: doc.page.width - 100 });
      doc.fontSize(10).fillColor(colors.textLight).text(
        'Only around 4–5% of babies arrive on their exact due date. Healthcare providers may adjust your due date based on ultrasound findings.',
        70, dY + 55, { align: 'center', width: doc.page.width - 140 }
      );

      doc.page.margins.bottom = oldBottom;

      renderFooter(3);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
