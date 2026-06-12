import PDFDocument from 'pdfkit';

export async function generateEggFreezingPDF(results, options = {}) {
  const { clinicName = "SORA Fertility Network" } = options;

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const colors = {
        primary: '#E83E8C', // SORA Pink
        secondary: '#0f172a', // Dark slate
        background: '#FFF0F5', // Light pink
        textDark: '#333333',
        textLight: '#666666',
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
      // PAGE 1: Planning Snapshot & Timeline
      // -------------------------------------------------------------
      doc.rect(0, 0, doc.page.width, 140).fill(colors.background);
      doc.fillColor(colors.primary).fontSize(28).text(clinicName, 50, 40, { align: 'center', width: doc.page.width - 100 });
      doc.fontSize(14).fillColor(colors.secondary).text('Egg Freezing Planner Report™', 50, 80, { align: 'center', width: doc.page.width - 100 });

      // Info Cards Row 1
      let startY = 180;
      const boxWidth = (doc.page.width - 120) / 2;
      const x2 = 50 + boxWidth + 20;

      // Left Box
      doc.roundedRect(50, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('Current Age', 70, startY + 20);
      doc.fontSize(20).fillColor(colors.secondary).text(`${results.age} years`, 70, startY + 45);

      // Right Box
      doc.roundedRect(x2, startY, boxWidth, 80, 10).fillOpacity(0.05).fill(colors.textLight);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.textLight).text('Planning Horizon', x2 + 20, startY + 20);
      doc.fontSize(16).fillColor(colors.textDark).text(results.timeline === 'Not specified' ? 'Undecided' : `Pregnancy planned ${results.timeline.toLowerCase()}`, x2 + 20, startY + 45, { width: boxWidth - 40 });

      // Category Box
      startY = 280;
      doc.roundedRect(50, startY, doc.page.width - 100, 100, 10).fillOpacity(0.05).fill(colors.primary);
      doc.fillOpacity(1);
      doc.fontSize(12).fillColor(colors.primary).text('Planning Category', 70, startY + 20);
      doc.fontSize(22).fillColor(colors.primary).text(results.category, 70, startY + 40, { width: doc.page.width - 140 });
      doc.fontSize(12).fillColor(colors.textDark).text(results.categoryDesc, 70, startY + 70, { width: doc.page.width - 140 });

      // Journey Timeline
      startY = 420;
      doc.fontSize(18).fillColor(colors.secondary).text('Egg Freezing Journey', 50, startY);
      
      const steps = [
        { title: '1. Consultation', desc: 'Discuss your goals with a specialist.' },
        { title: '2. AMH & Ultrasound', desc: 'Testing to estimate your ovarian reserve.' },
        { title: '3. Treatment Planning', desc: 'Custom protocol & medication timeline.' },
        { title: '4. Ovarian Stimulation', desc: '10-14 days of hormone injections.' },
        { title: '5. Egg Retrieval', desc: 'A quick 15-min procedure under sedation.' },
        { title: '6. Storage', desc: 'Eggs are vitrified (flash-frozen) for the future.' }
      ];

      let tY = startY + 30;
      steps.forEach(step => {
        doc.circle(60, tY + 6, 4).fillOpacity(1).fill(colors.primary);
        doc.fontSize(14).fillColor(colors.secondary).text(step.title, 80, tY);
        doc.fontSize(12).fillColor(colors.textLight).text(step.desc, 80, tY + 16);
        tY += 45;
      });

      renderFooter(1);

      // -------------------------------------------------------------
      // PAGE 2: Costs, Eggs, and Discussion Guide
      // -------------------------------------------------------------
      doc.addPage();
      
      let p2Y = 50;
      
      // Costs
      doc.fontSize(20).fillColor(colors.secondary).text('Estimated Costs (India)', 50, p2Y);
      p2Y += 30;

      const costs = [
        { name: 'Initial Consultation', price: '₹500–₹2,000' },
        { name: 'Hormone Testing', price: '₹1,000–₹5,000' },
        { name: 'Stimulation Meds', price: '₹40,000–₹80,000' },
        { name: 'Egg Retrieval Procedure', price: '₹80,000–₹1,50,000' },
        { name: 'Annual Storage', price: '₹10,000–₹20,000' }
      ];

      costs.forEach(item => {
        doc.roundedRect(50, p2Y, doc.page.width - 100, 30, 5).fillOpacity(0.05).fill(colors.textDark);
        doc.fillOpacity(1);
        doc.fontSize(12).fillColor(colors.textLight).text(item.name, 70, p2Y + 10);
        doc.fontSize(12).fillColor(colors.secondary).text(item.price, doc.page.width - 150, p2Y + 10, { align: 'right' });
        p2Y += 35;
      });

      doc.fontSize(16).fillColor(colors.primary).text('Total Estimated Range: ₹1.2–₹2.5 lakh', 50, p2Y + 10, { align: 'center', width: doc.page.width - 100 });
      p2Y += 50;

      // Understanding Egg Numbers
      doc.fontSize(20).fillColor(colors.secondary).text('Understanding Egg Numbers', 50, p2Y);
      p2Y += 30;
      doc.fontSize(12).fillColor(colors.textLight).text('Published studies suggest that women in different age groups often discuss different egg number targets with specialists to optimize chances of a future live birth.', 50, p2Y, { width: doc.page.width - 100, lineHeight: 1.5 });
      p2Y += 50;

      doc.roundedRect(50, p2Y, boxWidth, 60, 5).fillOpacity(0.05).fill(colors.textDark);
      doc.fillOpacity(1);
      doc.fontSize(10).fillColor(colors.textLight).text('Age under 35', 70, p2Y + 15);
      doc.fontSize(14).fillColor(colors.primary).text('15–20 mature eggs', 70, p2Y + 30);

      doc.roundedRect(x2, p2Y, boxWidth, 60, 5).fillOpacity(0.05).fill(colors.textDark);
      doc.fillOpacity(1);
      doc.fontSize(10).fillColor(colors.textLight).text('Age 35–37', x2 + 20, p2Y + 15);
      doc.fontSize(14).fillColor(colors.primary).text('20–25 mature eggs', x2 + 20, p2Y + 30);

      p2Y += 70;

      doc.roundedRect(50, p2Y, boxWidth, 60, 5).fillOpacity(0.05).fill(colors.textDark);
      doc.fillOpacity(1);
      doc.fontSize(10).fillColor(colors.textLight).text('Age 38–40', 70, p2Y + 15);
      doc.fontSize(14).fillColor(colors.primary).text('25–30 mature eggs', 70, p2Y + 30);

      p2Y += 90;

      // Discussion Guide
      doc.fontSize(20).fillColor(colors.secondary).text('Questions to Ask a Specialist', 50, p2Y);
      p2Y += 30;
      
      const qs = [
        'What ovarian reserve tests would you recommend for me?',
        'Based on my AMH, how many eggs might I retrieve in one cycle?',
        'How many stimulation cycles are commonly needed for my age?',
        'What are the exact expected costs including medication?',
        'How long can eggs remain frozen at this clinic?'
      ];

      qs.forEach(q => {
        doc.circle(60, p2Y + 5, 3).fillOpacity(1).fill(colors.textLight);
        doc.fontSize(12).fillColor(colors.textDark).text(q, 75, p2Y);
        p2Y += 25;
      });

      // Disclaimer Footer (Fixed Absolute Positioning)
      const oldBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      const dY = doc.page.height - 120;
      doc.rect(0, dY, doc.page.width, 120).fill(colors.background);
      doc.fontSize(12).fillColor(colors.textDark).text('Medical Disclaimer', 50, dY + 30, { align: 'center', width: doc.page.width - 100 });
      doc.fontSize(10).fillColor(colors.textLight).text(
        'SORA Egg Freezing Planner™ is intended for educational purposes only and does not provide medical advice, diagnosis, or treatment recommendations. Decisions regarding fertility preservation should always be made in consultation with qualified healthcare professionals.',
        70, dY + 55, { align: 'center', width: doc.page.width - 140 }
      );

      doc.page.margins.bottom = oldBottom;

      renderFooter(2);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
