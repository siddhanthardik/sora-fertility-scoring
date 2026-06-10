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
        doc.fillColor(colors.primary).fontSize(28).text(whiteLabel ? clinicName : 'SORA Fertility Network', 50, 40, { align: 'center' });
        doc.fontSize(14).fillColor(colors.secondary).text('Comprehensive FertiSTAT Assessment', { align: 'center' });
        doc.moveDown(3);
      } else {
        // Basic Header
        doc.moveDown(1);
        if (logoBuffer) {
           doc.image(logoBuffer, 50, 40, { width: 150 });
           doc.moveDown(2);
        } else {
           doc.fillColor('#000000').fontSize(24).text(whiteLabel ? clinicName : 'SORA Fertility Network', { align: 'center' });
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
