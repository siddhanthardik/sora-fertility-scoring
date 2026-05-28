/**
 * SORA Fertility widget.
 * FertiSTAT-style colour-band risk classification plus optional AAFA ovarian reserve cluster.
 */
(function() {
  const LEAD_API_URL = 'https://sora-fertility-bot.onrender.com/api/leads';
  const WP_CONFIG = window.FertilityCheckConfig || null;
  const ASSESSMENT_API_URL = WP_CONFIG?.assessmentApiUrl || 'https://sora-fertility-bot.onrender.com/api/assess';

  const steps = [
    {
      section: 'Start Here',
      id: 'tryingStatus',
      question: 'Which best describes your current fertility goal?',
      hint: 'This helps tailor the guidance. There are no right or wrong answers.',
      type: 'radio',
      key: 'tryingStatus',
      options: [
        { val: 'active', label: 'Actively trying now' },
        { val: 'planning', label: 'Planning a future pregnancy' },
        { val: 'awareness', label: 'Checking fertility awareness' }
      ]
    },
    {
      section: 'Start Here',
      id: 'age',
      question: 'What is your current age?',
      hint: 'Age is one of the strongest predictors of egg quantity and egg quality.',
      type: 'number',
      min: 18,
      max: 55,
      key: 'age',
      placeholder: 'Years'
    },
    {
      section: 'Start Here',
      id: 'heightweight',
      question: 'What is your height and weight?',
      hint: 'These are used only to calculate BMI, which can affect ovulation and treatment planning.',
      type: 'double'
    },
    {
      section: 'Fertility Context',
      id: 'prevBirth',
      question: 'Have you ever given birth to a child?',
      hint: 'A previous live birth is a positive history factor, but does not rule out current issues.',
      type: 'radio',
      key: 'prevBirth',
      options: [
        { val: 'yes', label: 'Yes' },
        { val: 'no', label: 'No' }
      ]
    },
    {
      section: 'Fertility Context',
      id: 'tryDuration',
      question: 'How long have you been trying to conceive?',
      hint: 'Specialist referral timing depends strongly on age and how long you have been trying.',
      type: 'radio',
      key: 'tryDuration',
      options: [
        { val: 'notTrying', label: 'Not currently trying' },
        { val: 'under6', label: 'Less than 6 months' },
        { val: 'sixToEleven', label: '6-11 months' },
        { val: 'over12', label: '12 months or longer' }
      ]
    },
    {
      section: 'Fertility Context',
      id: 'intercourseTiming',
      question: 'When trying, how often do you have intercourse around the fertile window?',
      hint: 'The fertile window is the few days before ovulation and the day of ovulation.',
      type: 'radio',
      key: 'intercourseTiming',
      options: [
        { val: 'notTrying', label: 'Not currently trying' },
        { val: 'wellTimed', label: 'Regular intercourse during the fertile window' },
        { val: 'infrequent', label: 'Intercourse may be too infrequent' },
        { val: 'uncertain', label: 'Fertile-window timing is uncertain' }
      ]
    },
    {
      section: 'Fertility Context',
      id: 'partnerSperm',
      question: 'Is there a known partner sperm factor?',
      hint: 'Fertility is a couple-level issue. Semen testing is part of a complete evaluation.',
      type: 'radio',
      key: 'partnerSperm',
      options: [
        { val: 'no', label: 'No known issue' },
        { val: 'yes', label: 'Yes, known sperm factor' },
        { val: 'unknown', label: 'Unknown / not tested' }
      ]
    },
    {
      section: 'Cycles',
      id: 'cycleReg',
      question: 'Are your periods usually regular?',
      hint: 'Regular cycles usually suggest regular ovulation, although this is not guaranteed.',
      type: 'radio',
      key: 'cycleReg',
      options: [
        { val: 'regular', label: 'Yes, regular' },
        { val: 'irregular', label: 'No, irregular or absent' }
      ]
    },
    {
      section: 'Cycles',
      id: 'cycleLength',
      question: 'What is your usual cycle length?',
      hint: 'Count from the first day of one period to the first day of the next period.',
      type: 'radio',
      key: 'cycleLength',
      options: [
        { val: 'short', label: 'Less than 21 days' },
        { val: 'normal', label: '21-35 days' },
        { val: 'long', label: 'More than 35 days' },
        { val: 'absent', label: 'Absent periods' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Cycles',
      id: 'pcos',
      question: 'Have you been diagnosed with PCOS?',
      hint: 'PCOS can affect ovulation and may cause irregular cycles or hormonal variances.',
      type: 'radio',
      key: 'pcos',
      options: [
        { val: 'yes', label: 'Yes' },
        { val: 'no', label: 'No' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Health Background',
      id: 'thyroid',
      question: 'Do you have a known thyroid condition?',
      hint: 'Thyroid imbalance can affect ovulation, miscarriage risk, and pregnancy health.',
      type: 'radio',
      key: 'thyroid',
      options: [
        { val: 'no', label: 'No' },
        { val: 'treated', label: 'Yes, treated' },
        { val: 'untreated', label: 'Yes, untreated / uncontrolled' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Health Background',
      id: 'diabetes',
      question: 'Have you been diagnosed with diabetes, Type 1 or Type 2?',
      hint: 'Blood sugar control matters before pregnancy because it affects clinical outcomes.',
      type: 'radio',
      key: 'diabetes',
      options: [
        { val: 'no', label: 'No' },
        { val: 'controlled', label: 'Yes, well controlled' },
        { val: 'uncontrolled', label: 'Yes, not well controlled' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Health Background',
      id: 'familyEarlyMenopause',
      question: 'Does your mother or sister have a history of menopause before age 45?',
      hint: 'Early menopause in close family members suggests risk of earlier reserve decline.',
      type: 'radio',
      key: 'familyEarlyMenopause',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Pregnancy History',
      id: 'pregnancyLosses',
      question: 'Have you had any pregnancy losses or miscarriages?',
      hint: 'Two or more losses deserve specialist review even if conception happens easily.',
      type: 'radio',
      key: 'pregnancyLosses',
      options: [
        { val: 'none', label: 'None' },
        { val: 'one', label: 'One' },
        { val: 'twoPlus', label: 'Two or more' }
      ]
    },
    {
      section: 'Pregnancy History',
      id: 'ectopicPregnancy',
      question: 'Have you ever had an ectopic pregnancy?',
      hint: 'An ectopic pregnancy can sometimes be linked with fallopian tube scarring.',
      type: 'radio',
      key: 'ectopicPregnancy',
      options: [
        { val: 'yes', label: 'Yes' },
        { val: 'no', label: 'No' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Pelvic & Uterine Health',
      id: 'endo',
      question: 'Have you been diagnosed with endometriosis?',
      hint: 'Endometriosis can affect fertility through anatomy, inflammation, or scarring.',
      type: 'radio',
      key: 'endo',
      options: [
        { val: 'yes', label: 'Yes' },
        { val: 'no', label: 'No' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Pelvic & Uterine Health',
      id: 'pelvicPain',
      question: 'Do you have painful periods or deep pelvic pain?',
      hint: 'This can help flag possible endometriosis severity or pelvic adhesions.',
      type: 'radio',
      key: 'pelvicPain',
      options: [
        { val: 'none', label: 'No significant pain' },
        { val: 'mild', label: 'Yes, mild/moderate pain' },
        { val: 'severe', label: 'Yes, severe or deep pain' }
      ]
    },
    {
      section: 'Pelvic & Uterine Health',
      id: 'uterineHistory',
      question: 'Have you had fibroids, uterine surgery, or a known uterine abnormality?',
      hint: 'Uterine factors can affect embryo implantation or miscarriage risk.',
      type: 'radio',
      key: 'uterineHistory',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Pelvic & Uterine Health',
      id: 'pelvicSurgery',
      question: 'Have you had pelvic surgery (e.g. for cysts, appendix, endometriosis)?',
      hint: 'Pelvic or abdominal surgeries can sometimes leave minor tubal scar tissues.',
      type: 'radio',
      key: 'pelvicSurgery',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Infection History',
      id: 'stiHistory',
      question: 'Have you ever had an STI that can affect fertility, such as chlamydia?',
      hint: 'Certain infections can affect the fallopian tubes silently.',
      type: 'radio',
      key: 'stiHistory',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Infection History',
      id: 'tbHistory',
      question: 'Have you ever had tuberculosis?',
      hint: 'TB can rarely affect reproductive tracts if it involved the pelvic cavity.',
      type: 'radio',
      key: 'tbHistory',
      options: [
        { val: 'no', label: 'No' },
        { val: 'pulmonary', label: 'Yes, pulmonary / lung TB' },
        { val: 'pelvic', label: 'Yes, abdominal / pelvic / genital TB' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Infection History',
      id: 'tbTreatment',
      question: 'Have you ever been treated for TB?',
      hint: 'TB therapy timing is relevant for proactive pregnancy timelines.',
      type: 'radio',
      key: 'tbTreatment',
      options: [
        { val: 'no', label: 'No' },
        { val: 'completed', label: 'Yes, completed treatment' },
        { val: 'current', label: 'Yes, currently on treatment' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Medical Treatments',
      id: 'cancerTreatment',
      question: 'Have you ever had chemotherapy or radiation treatment?',
      hint: 'Chemo and radiation can significantly affect biological reserve markers.',
      type: 'radio',
      key: 'cancerTreatment',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Lifestyle',
      id: 'smoking',
      question: 'Do you currently smoke cigarettes or tobacco?',
      hint: 'Smoking can affect egg quality, miscarriage risk, and clinical success metrics.',
      type: 'radio',
      key: 'smoking',
      options: [
        { val: 'no', label: 'No' },
        { val: 'occasional', label: 'Yes, occasionally' },
        { val: 'daily', label: 'Yes, daily' }
      ]
    },
    {
      section: 'Lifestyle',
      id: 'caffeine',
      question: 'How much caffeine do you usually consume per day?',
      hint: 'A standard brewed coffee cup typically contains 100 mg of caffeine.',
      type: 'radio',
      key: 'caffeine',
      options: [
        { val: 'low', label: 'Low: 0-100 mg/day' },
        { val: 'moderate', label: 'Moderate: 100-200 mg/day' },
        { val: 'high', label: 'High: more than 200 mg/day' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Lifestyle',
      id: 'alcohol',
      question: 'Do you drink more than 7 alcoholic drinks per week?',
      hint: 'One drink means roughly a small glass of wine or single beer.',
      type: 'radio',
      key: 'alcohol',
      options: [
        { val: 'no', label: 'No' },
        { val: 'yes', label: 'Yes' },
        { val: 'notSure', label: 'Not sure' }
      ]
    },
    {
      section: 'Lifestyle',
      id: 'recreationalDrugs',
      question: 'Do you currently use recreational or non-prescribed drugs?',
      hint: 'Recreational substances may interact with reproductive endocrine balancing.',
      type: 'radio',
      key: 'recreationalDrugs',
      options: [
        { val: 'no', label: 'No' },
        { val: 'occasional', label: 'Yes, occasionally' },
        { val: 'regular', label: 'Yes, regularly' }
      ]
    },
    {
      section: 'Optional Labs',
      id: 'labToggle',
      question: 'Would you like to add AMH, FSH, and AFC lab values?',
      hint: 'Adding these indicators enables separate AAFA-aligned ovarian reserve cluster reporting.',
      type: 'radio',
      key: 'includeLab',
      options: [
        { val: 'yes', label: 'Yes, add clinical labs' },
        { val: 'no', label: 'No, skip labs' }
      ]
    },
    {
      section: 'Optional Labs',
      id: 'labs',
      question: 'Enter your clinical lab values',
      hint: 'AMH (ovarian marker), FSH (measured cycle day 2-4), and AFC (Antral Follicle Count total follicles).',
      type: 'labs'
    }
  ];

  function initWidget(container) {
    let currentStep = 0;
    let formData = getInitialFormData();
    let autoAdvanceTimer = null;

    function getVisibleStep() {
      return steps[currentStep];
    }

    function getProgressTotal() {
      return formData.includeLab === 'yes' ? steps.length : steps.length - 1;
    }

    function render() {
      if (currentStep < steps.length) {
        const step = getVisibleStep();
        if (step.id === 'labs' && formData.includeLab !== 'yes') {
          currentStep += 1;
          render();
          return;
        }
        renderStep(step);
      } else if (!formData.userName || !formData.mobile || !formData.sex) {
        renderContactGate();
      } else {
        renderReport();
      }
    }

    function renderStep(step) {
      let html = '<div class="fc-widget-inner">';
      html += '<h1>&#127800; SORA Fertility</h1>';
      html += renderProgress();
      if (step.section) html += `<div class="step-context">${step.section}</div>`;
      html += `<div class="question">${step.question}</div>`;
      if (step.hint) html += `<div class="hint">${step.hint}</div>`;

      if (step.type === 'number') {
        html += `<input type="number" id="fieldInput" min="${step.min}" max="${step.max}" placeholder="${step.placeholder || ''}" value="${formData[step.key] || ''}">`;
        html += '<div class="error" id="errorMsg"></div>';
      } else if (step.type === 'double') {
        html += `<div class="input-group"><label>Height</label><input type="number" id="heightInput" placeholder="Height (cm)" value="${formData.height || ''}" step="any"></div>`;
        html += `<div class="input-group"><label>Weight</label><input type="number" id="weightInput" placeholder="Weight (kg)" value="${formData.weight || ''}" step="any"></div>`;
        html += '<div class="error" id="errorMsg"></div>';
      } else if (step.type === 'radio') {
        html += '<div class="radio-group" id="radioGroup">';
        step.options.forEach((opt) => {
          const checked = formData[step.key] === opt.val ? 'checked' : '';
          html += `<label class="radio-option${checked ? ' selected' : ''}"><input type="radio" name="${step.key}" value="${opt.val}" ${checked}> ${opt.label}</label>`;
        });
        html += '</div><div class="error" id="errorMsg"></div>';
      } else if (step.type === 'labs') {
        html += `<div class="input-group"><label>AMH value</label><div class="lab-row"><input type="number" id="amhValue" placeholder="Value" value="${formData.amhValue || ''}" step="any"><select id="amhUnit"><option value="ng/mL"${formData.amhUnit === 'ng/mL' ? ' selected' : ''}>ng/mL</option><option value="pmol/L"${formData.amhUnit === 'pmol/L' ? ' selected' : ''}>pmol/L</option></select></div></div>`;
        html += `<div class="input-group"><label>FSH value, cycle day 2-4 (IU/L)</label><input type="number" id="fshInput" placeholder="Value" value="${formData.fsh || ''}" step="any"></div>`;
        html += `<div class="input-group"><label>Antral follicle count (AFC) from ultrasound</label><input type="number" id="afcInput" placeholder="Total follicles" value="${formData.afc || ''}" step="1"></div>`;
        html += '<div class="error" id="errorMsg"></div>';
      }

      html += `<button class="btn" id="nextBtn">${getNextLabel(step)}</button>`;
      if (currentStep > 0) html += '<button class="btn secondary" id="backBtn">Back</button>';
      html += '</div>';
      container.innerHTML = html;

      container.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', (event) => {
          formData[step.key] = event.target.value;
          container.querySelectorAll('.radio-option').forEach((label) => label.classList.remove('selected'));
          event.target.closest('.radio-option').classList.add('selected');
          clearTimeout(autoAdvanceTimer);
          autoAdvanceTimer = setTimeout(() => {
            if (currentStep < steps.length - 1) {
              currentStep += 1;
              render();
            }
          }, 220);
        });
      });

      container.querySelector('#nextBtn').addEventListener('click', () => {
        clearTimeout(autoAdvanceTimer);
        if (!validateStep(step)) return;
        currentStep += 1;
        render();
      });

      const backBtn = container.querySelector('#backBtn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          clearTimeout(autoAdvanceTimer);
          currentStep -= 1;
          render();
        });
      }
    }

    function renderProgress() {
      const total = getProgressTotal();
      const visibleCurrent = Math.min(currentStep + 1, total);
      let html = `<div class="progress-copy">Step ${visibleCurrent} of ${total} · Most people finish in about 3 minutes · You can go back anytime</div>`;
      html += '<div class="step-indicator">';
      for (let i = 1; i <= total; i += 1) {
        html += `<div class="step-dot${i <= visibleCurrent ? ' active' : ''}"></div>`;
      }
      html += '</div>';
      return html;
    }

    function getNextLabel(step) {
      if (step.id === 'labToggle' && formData.includeLab !== 'yes') return 'Show My Risk';
      if (step.id === 'labs') return 'Show My Risk';
      return 'Continue';
    }

    function validateStep(step) {
      showError('');

      if (step.type === 'number') {
        const value = Number(container.querySelector('#fieldInput').value);
        if (!Number.isFinite(value) || value < step.min || value > step.max) {
          showError(`Enter a valid number from ${step.min} to ${step.max}.`);
          return false;
        }
        formData[step.key] = value;
      } else if (step.type === 'double') {
        const height = Number(container.querySelector('#heightInput').value);
        const weight = Number(container.querySelector('#weightInput').value);
        if (!Number.isFinite(height) || !Number.isFinite(weight) || height < 130 || height > 220 || weight < 30 || weight > 250) {
          showError('Please enter realistic height in cm and weight in kg.');
          return false;
        }
        formData.height = height;
        formData.weight = weight;
        formData.bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));
      } else if (step.type === 'radio') {
        if (!formData[step.key]) {
          showError('Please select an option.');
          return false;
        }
      } else if (step.type === 'labs') {
        const amhValue = container.querySelector('#amhValue').value.trim();
        const amhUnit = container.querySelector('#amhUnit').value;
        const fsh = container.querySelector('#fshInput').value.trim();
        const afc = container.querySelector('#afcInput').value.trim();
        const values = [Number(amhValue), Number(fsh), Number(afc)];

        if (!amhValue || !fsh || !afc || !values.every(Number.isFinite) || values.some((value) => value < 0)) {
          showError('Please enter AMH, FSH, and AFC values, or go back and skip labs.');
          return false;
        }

        formData.amhValue = amhValue;
        formData.amhUnit = amhUnit;
        formData.fsh = fsh;
        formData.afc = afc;
      }

      return true;
    }

    function showError(message) {
      const error = container.querySelector('#errorMsg');
      if (error) error.textContent = message;
    }

    function renderContactGate() {
      container.innerHTML = `
        <div class="fc-widget-inner contact-gate">
          <h1>Your summary is ready</h1>
          <p class="hint">Where should we attach this assessment? This helps personalize your report and lets an advisor follow up only if you request it.</p>
          <div class="input-group"><label>Name</label><input type="text" id="gateName" placeholder="Your full name" value="${formData.userName || ''}"></div>
          <div class="input-group"><label>Mobile number</label><input type="tel" id="gateMobile" placeholder="+91 98765 43210" value="${formData.mobile || ''}"></div>
          <div class="input-group">
            <label>Sex</label>
            <select id="gateSex">
              <option value="">Select</option>
              <option value="Female"${formData.sex === 'Female' ? ' selected' : ''}>Female</option>
              <option value="Male"${formData.sex === 'Male' ? ' selected' : ''}>Male</option>
              <option value="Other"${formData.sex === 'Other' ? ' selected' : ''}>Other</option>
              <option value="Prefer not to say"${formData.sex === 'Prefer not to say' ? ' selected' : ''}>Prefer not to say</option>
            </select>
          </div>
          <label class="checkbox-label"><input type="checkbox" id="gateConsent" ${formData.contactConsent ? 'checked' : ''}> <span>I agree to receive my fertility summary and follow-up information on this mobile number.</span></label>
          <div class="error" id="errorMsg"></div>
          <button class="btn" id="showSummaryBtn">Show My Summary</button>
          <button class="btn secondary" id="gateBackBtn">Back</button>
        </div>
      `;

      container.querySelector('#showSummaryBtn').addEventListener('click', () => {
        const name = container.querySelector('#gateName').value.trim();
        const mobile = container.querySelector('#gateMobile').value.trim();
        const sex = container.querySelector('#gateSex').value;
        const consent = container.querySelector('#gateConsent').checked;

        if (!name || name.length < 2) {
          showError('Please enter your name.');
          return;
        }
        if (!isValidPhone(mobile)) {
          showError('Please enter a valid mobile number.');
          return;
        }
        if (!sex) {
          showError('Please select sex for the report.');
          return;
        }
        if (!consent) {
          showError('Please confirm consent to show and send your summary.');
          return;
        }

        formData.userName = name;
        formData.mobile = mobile;
        formData.sex = sex;
        formData.contactConsent = true;
        renderReport();
      });

      container.querySelector('#gateBackBtn').addEventListener('click', () => {
        currentStep = Math.max(0, steps.length - 1);
        render();
      });
    }

    function isValidPhone(value) {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 8 && digits.length <= 15;
    }

    async function renderReport() {
      container.innerHTML = '<div class="fc-widget-inner"><h1>Preparing Fertility Summary</h1><p class="lead-msg">Securely calculating your result...</p></div>';

      let assessment;
      try {
        assessment = await requestAssessment();
      } catch (error) {
        container.innerHTML = `
          <div class="fc-widget-inner">
            <h1>Unable to Prepare Summary</h1>
            <p class="error-text">${escapeHTML(error.message || 'The assessment service could not be reached.')}</p>
            <button class="btn secondary" id="gateBackBtn">Back</button>
          </div>
        `;
        container.querySelector('#gateBackBtn').addEventListener('click', renderContactGate);
        return;
      }

      const risk = normalizeAssessment(assessment);
      const ovarianReserve = risk.ovarianReserve;
      const flagged = risk.flaggedFactors;

      let html = '<div class="fc-widget-inner">';
      html += '<h1>&#128202; Fertility Summary</h1>';
      html += `<p class="summary-for">Prepared for <strong>${escapeHTML(formData.userName)}</strong>, age <strong>${formData.age}</strong>, sex <strong>${escapeHTML(formData.sex)}</strong></p>`;
      html += `<div class="risk-category category-${risk.category}">Overall Risk: <strong>${risk.category.toUpperCase()}</strong></div>`;
      html += renderRiskVisual(risk);
      html += `<p class="risk-counts">${risk.redCount} red factor${risk.redCount === 1 ? '' : 's'} and ${risk.amberCount} amber factor${risk.amberCount === 1 ? '' : 's'} identified.</p>`;
      html += `<div class="referral-urgency"><strong>Referral Urgency:</strong> ${risk.referralUrgency}</div>`;

      if (ovarianReserve) {
        html += `<div class="lab-note">&#128300; Ovarian Reserve: <strong>${ovarianReserve.reserve}</strong> (Cluster ${ovarianReserve.cluster})</div>`;
      }

      html += renderSummaryFindings(flagged);
      html += `<div class="recommendation"><strong>${escapeHTML(risk.recommendation)}</strong></div>`;
      html += renderDownloadReportBox();
      html += renderDetailedReport(risk, ovarianReserve);
      html += '<p class="disclaimer">&#9888;&#65039; This is an educational risk-awareness summary, not a diagnosis or a prediction of pregnancy. The detailed report is available by email/download.</p>';
      html += '<button class="btn secondary" id="restartBtn">Start Over</button>';
      html += '</div>';

      container.innerHTML = html;
      container.querySelector('#downloadPdfBtn').addEventListener('click', () => handleReportDownload(risk, ovarianReserve));
      container.querySelector('#restartBtn').addEventListener('click', restart);
    }

    function renderFactorList(results) {
      const flagged = results.filter((item) => item.level !== 'green');
      if (!flagged.length) {
        return '<div class="factor-list"><h3>Red and amber factors</h3><p>No red or amber factors were identified from your answers.</p></div>';
      }

      let html = '<div class="factor-list"><h3>Red and amber factors</h3><ul>';
      flagged.forEach((item) => {
        const marker = item.level === 'red' ? '&#128308;' : '&#128992;';
        html += `<li><span class="factor-marker">${marker}</span> <strong>${item.title}:</strong> ${item.label}</li>`;
      });
      html += '</ul></div>';
      return html;
    }

    function renderReferralTriggers(triggers) {
      if (!triggers.length) return '';

      let html = '<div class="trigger-list"><h3>Clinical referral triggers</h3><ul>';
      triggers.forEach((trigger) => {
        html += `<li>${trigger}</li>`;
      });
      html += '</ul></div>';
      return html;
    }

    function renderRiskVisual(risk) {
      const redWidth = Math.min(100, risk.redCount * 18);
      const amberWidth = Math.min(100, risk.amberCount * 14);
      const greenWidth = risk.category === 'low' ? 72 : risk.category === 'medium' ? 42 : 22;
      return `
        <div class="risk-visual">
          <div class="risk-meter category-${risk.category}">
            <span style="width:${greenWidth}%"></span>
          </div>
          <div class="mini-bars">
            <div><label>Red factors</label><span><i class="red-bar" style="width:${redWidth}%"></i></span><strong>${risk.redCount}</strong></div>
            <div><label>Amber factors</label><span><i class="amber-bar" style="width:${amberWidth}%"></i></span><strong>${risk.amberCount}</strong></div>
          </div>
        </div>
      `;
    }

    function renderSummaryFindings(flagged) {
      const topFindings = flagged.slice(0, 3);
      if (!topFindings.length) {
        return '<div class="summary-card"><h3>Key Findings</h3><p>No red or amber factors were identified from your answers.</p></div>';
      }

      let html = '<div class="summary-card"><h3>Key Findings</h3><ul>';
      topFindings.forEach((item) => {
        const marker = item.level === 'red' ? '&#128308;' : '&#128992;';
        html += `<li>${marker} <strong>${item.title}:</strong> ${item.label}</li>`;
      });
      html += '</ul><p class="summary-note">Your detailed report includes explanations and discussion points for all flagged factors.</p></div>';
      return html;
    }

    function renderDownloadReportBox() {
      return `
        <div class="report-actions">
          <h3>Get the detailed PDF report</h3>
          <p>Enter your email to receive the detailed report and save a local PDF copy on this device.</p>
          <div class="input-group"><label>Email for report delivery</label><input type="email" id="reportEmail" placeholder="you@example.com" value="${formData.reportEmail || ''}"></div>
          <label class="checkbox-label"><input type="checkbox" id="reportConsent" ${formData.reportConsent ? 'checked' : ''}> <span>I agree to receive my detailed fertility report by email.</span></label>
          <button class="btn" id="downloadPdfBtn">Email and Download Detailed Report</button>
          <p id="reportMsg" class="lead-msg"></p>
        </div>
      `;
    }

    function renderDetailedReport(risk, ovarianReserve) {
      const flagged = risk.flaggedFactors;
      let html = '<div class="pdf-report pdf-only">';
      html += '<div class="pdf-hero"><div><h2>Detailed SORA Fertility Awareness Report</h2><p>Evidence-aligned fertility risk summary for clinician discussion</p></div><strong>SORA Fertility</strong></div>';
      html += '<div class="patient-strip">';
      html += `<div><span>Name</span><strong>${escapeHTML(formData.userName)}</strong></div>`;
      html += `<div><span>Age</span><strong>${formData.age}</strong></div>`;
      html += `<div><span>Sex</span><strong>${escapeHTML(formData.sex)}</strong></div>`;
      html += `<div><span>Mobile</span><strong>${escapeHTML(formData.mobile)}</strong></div>`;
      html += `<div><span>Report Date</span><strong>${new Date().toLocaleDateString()}</strong></div>`;
      html += '</div>';
      html += '<div class="report-summary-grid">';
      html += `<div><span>Overall Risk</span><strong>${risk.category.toUpperCase()}</strong></div>`;
      html += `<div><span>Referral Guidance</span><strong>${risk.referralUrgency}</strong></div>`;
      html += `<div><span>Red Factors</span><strong>${risk.redCount}</strong></div>`;
      html += `<div><span>Amber Factors</span><strong>${risk.amberCount}</strong></div>`;
      if (ovarianReserve) {
        html += `<div><span>Ovarian Reserve</span><strong>${ovarianReserve.reserve} (Cluster ${ovarianReserve.cluster})</strong></div>`;
      }
      html += '</div>';

      html += renderRiskVisual(risk);
      html += renderReferralTriggers(risk.referralTriggers);

      html += '<h3>What This Means</h3>';
      html += `<p>${escapeHTML(risk.detailedMeaning)}</p>`;

      if (flagged.length) {
        html += '<h3>Detailed Factor Notes</h3>';
        flagged.forEach((item) => {
          html += `<div class="report-factor ${item.level}">`;
          html += `<h4>${item.title}: ${item.label}</h4>`;
          html += `<p>${escapeHTML(item.detail || 'This factor can be useful context for a fertility specialist.')}</p>`;
          html += '</div>';
        });
      } else {
        html += '<h3>Detailed Factor Notes</h3><p>No red or amber factors were identified from the answers provided.</p>';
      }

      html += '<h3>Suggested Discussion Points For A Clinician</h3>';
      html += '<ul>';
      html += '<li>Review cycle pattern, ovulation history, and age-specific referral timing.</li>';
      html += '<li>Consider semen analysis when a sperm-contributing partner is involved.</li>';
      html += '<li>Discuss whether tubal, uterine, endocrine, or ovarian reserve testing is appropriate.</li>';
      if (ovarianReserve) html += '<li>Interpret AMH, FSH, and AFC together rather than relying on one marker alone.</li>';
      html += '</ul>';
      html += '<p class="sources"><strong>Scientific basis:</strong> FertiSTAT: Bunting L, Boivin J. Human Reproduction. 2010;25(7):1722-1733. AAFA/AFA: Xu H, et al. J Assist Reprod Genet. 2020;37(4):963-972. Lab categories use simplified, source-aligned thresholds and should be interpreted by a clinician.</p>';
      html += '<p class="disclaimer">&#9888;&#65039; This report is educational and is not a diagnosis, treatment plan, or pregnancy prediction.</p>';
      html += '</div>';
      return html;
    }

    async function requestAssessment() {
      const response = await fetch(ASSESSMENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sora-Clinic-Id': WP_CONFIG?.clinicId || ''
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false || !result?.assessment) {
        throw new Error(result?.message || 'Assessment service failed.');
      }
      return result.assessment;
    }

    function normalizeAssessment(assessment) {
      return {
        category: assessment.category || 'low',
        redCount: Number(assessment.redCount || 0),
        amberCount: Number(assessment.amberCount || 0),
        referralUrgency: assessment.referralUrgency || '',
        referralTriggers: Array.isArray(assessment.referralTriggers) ? assessment.referralTriggers : [],
        flaggedFactors: Array.isArray(assessment.flaggedFactors) ? assessment.flaggedFactors : [],
        ovarianReserve: assessment.ovarianReserve || null,
        recommendation: assessment.recommendation || '',
        detailedMeaning: assessment.detailedMeaning || ''
      };
    }

    function handleReportDownload(risk, ovarianReserve) {
      const emailInput = container.querySelector('#reportEmail');
      const consentInput = container.querySelector('#reportConsent');
      const message = container.querySelector('#reportMsg');
      const email = emailInput.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.innerHTML = '<span class="error-text">Enter a valid email address for the report.</span>';
        return;
      }
      if (!consentInput.checked) {
        message.innerHTML = '<span class="error-text">Please confirm email consent to continue.</span>';
        return;
      }

      formData.reportEmail = email;
      formData.reportConsent = true;
      message.innerHTML = '<span class="success-text">Preparing your report...</span>';

      const originalTitle = document.title;
      document.title = buildReportFileName();

      submitReportRequest(risk, ovarianReserve, email)
        .finally(() => {
          window.print();
          setTimeout(() => {
            document.title = originalTitle;
          }, 1500);
        });
    }

    function buildReportFileName() {
      const name = (formData.userName || 'fertility-report')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'fertility-report';
      const year = new Date().getFullYear();
      return `${name}-${formData.age || 'age'}-${year}`;
    }

    function submitReportRequest(risk, ovarianReserve, email) {
      const payload = buildLeadPayload(risk, ovarianReserve, {
        name: formData.userName,
        email,
        phone: formData.mobile,
        country: '',
        report_requested: true,
        report_delivery_email: email
      });

      return postReportPayload(payload).then(async (response) => {
        const message = container.querySelector('#reportMsg');
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.success === false) {
          throw new Error(result?.data?.message || 'Report request failed');
        }
        if (message) message.innerHTML = '<span class="success-text">Report saved and emailed. Your PDF download will open now.</span>';
      }).catch((error) => {
        const message = container.querySelector('#reportMsg');
        const detail = error?.message || 'Email sending could not be confirmed.';
        if (message) message.innerHTML = `<span class="error-text">${escapeHTML(detail)}</span>`;
      });
    }

    function postReportPayload(payload) {
      if (WP_CONFIG?.ajaxUrl && WP_CONFIG?.nonce) {
        const body = new URLSearchParams();
        body.set('action', 'fertility_check_report');
        body.set('nonce', WP_CONFIG.nonce);
        body.set('payload', JSON.stringify(payload));

        return fetch(WP_CONFIG.ajaxUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body
        });
      }

      return Promise.reject(new Error('Report email/database delivery requires the WordPress plugin runtime. Open this widget on a WordPress page with SMTP configured.'));
    }

    function renderLeadCapture() {
      return `
        <div class="lead-capture" id="leadCapture">
          <h3>&#128203; Request Consultation Options</h3>
          <p>Share your details only if you would like clinic or fertility advisor follow-up.</p>
          <div class="input-group"><label>Name</label><input type="text" id="leadName" placeholder="Your full name"></div>
          <div class="input-group"><label>Email</label><input type="email" id="leadEmail" placeholder="you@example.com"></div>
          <div class="input-group"><label>Phone, optional</label><input type="tel" id="leadPhone" placeholder="+123456789"></div>
          <div class="input-group"><label>Country</label><input type="text" id="leadCountry" placeholder="e.g., India"></div>
          <label class="checkbox-label"><input type="checkbox" id="consentCheck"> <span>I agree to share my results and contact details for fertility clinic matching.</span></label>
          <button class="btn" id="submitLeadBtn" disabled>Submit and Get Matched</button>
          <p id="leadMsg" class="lead-msg"></p>
        </div>
      `;
    }

    function submitLead(risk, ovarianReserve) {
      const leadData = {
        name: container.querySelector('#leadName').value.trim(),
        email: container.querySelector('#leadEmail').value.trim(),
        phone: container.querySelector('#leadPhone').value.trim(),
        country: container.querySelector('#leadCountry').value.trim()
      };
      const message = container.querySelector('#leadMsg');

      if (!leadData.name || !leadData.email || !leadData.country) {
        message.innerHTML = '<span class="error-text">Please fill in name, email, and country.</span>';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
        message.innerHTML = '<span class="error-text">Enter a valid email address.</span>';
        return;
      }

      const payload = {
        source: 'web_widget',
        ...formData,
        risk_category: risk.category,
        red_count: risk.redCount,
        amber_count: risk.amberCount,
        triage_index: null,
        referral_urgency: risk.referralUrgency,
        referral_triggers: risk.referralTriggers,
        weighted_risk_items: [],
        flagged_factors: publicFlaggedFactors(risk),
        ovarian_reserve: ovarianReserve,
        ...leadData,
        consent_marketing: true
      };

      fetch(LEAD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          if (!response.ok) throw new Error('Lead submission failed');
          message.innerHTML = '<span class="success-text">Thank you. A fertility advisor may contact you with clinic options.</span>';
          container.querySelector('#submitLeadBtn').disabled = true;
          container.querySelector('#consentCheck').disabled = true;
        })
        .catch(() => {
          message.innerHTML = '<span class="error-text">Something went wrong. Please try again later.</span>';
        });
    }

    function buildLeadPayload(risk, ovarianReserve, leadData) {
      return {
        source: 'web_widget',
        ...formData,
        risk_category: risk.category,
        red_count: risk.redCount,
        amber_count: risk.amberCount,
        triage_index: null,
        referral_urgency: risk.referralUrgency,
        referral_triggers: risk.referralTriggers,
        weighted_risk_items: [],
        flagged_factors: publicFlaggedFactors(risk),
        ovarian_reserve: ovarianReserve,
        ...leadData,
        name: leadData.name || formData.userName,
        phone: leadData.phone || formData.mobile,
        sex: formData.sex
      };
    }

    function publicFlaggedFactors(risk) {
      return risk.flaggedFactors.map((item) => ({
        key: item.key,
        title: item.title,
        level: item.level,
        label: item.label
      }));
    }

    function escapeHTML(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function restart() {
      currentStep = 0;
      formData = getInitialFormData();
      render();
    }

    render();
  }

  function getInitialFormData() {
    return {
      age: '',
      tryingStatus: '',
      height: '',
      weight: '',
      bmi: '',
      prevBirth: '',
      pregnancyLosses: '',
      ectopicPregnancy: '',
      cycleReg: '',
      cycleLength: '',
      pcos: '',
      endo: '',
      pelvicPain: '',
      thyroid: '',
      diabetes: '',
      smoking: '',
      alcohol: '',
      tryDuration: '',
      intercourseTiming: '',
      partnerSperm: '',
      stiHistory: '',
      pelvicSurgery: '',
      uterineHistory: '',
      tbHistory: '',
      tbTreatment: '',
      familyEarlyMenopause: '',
      recreationalDrugs: '',
      caffeine: '',
      cancerTreatment: '',
      includeLab: '',
      amhValue: '',
      amhUnit: 'ng/mL',
      fsh: '',
      afc: '',
      userName: '',
      mobile: '',
      sex: '',
      contactConsent: false,
      reportEmail: '',
      reportConsent: false
    };
  }

  function initAllWidgets() {
    const containers = document.querySelectorAll('[data-fertility-widget], .fertility-widget, #fertility-widget');
    containers.forEach((container) => {
      if (container.dataset.fcInitialized) return;
      container.dataset.fcInitialized = 'true';
      initWidget(container);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllWidgets);
  } else {
    initAllWidgets();
  }
})();
