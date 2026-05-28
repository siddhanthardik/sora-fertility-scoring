const AMH_PMOL_PER_NG = 7.14;

const factorDefinitions = {
  age: { title: 'Age' },
  bmi: { title: 'BMI' },
  prevBirth: { title: 'Previous live birth' },
  cycleReg: { title: 'Menstrual cycle regularity' },
  cycleLength: { title: 'Cycle length' },
  pcos: { title: 'PCOS diagnosis' },
  endo: { title: 'Endometriosis diagnosis' },
  pelvicPain: { title: 'Painful periods or pelvic pain' },
  thyroid: { title: 'Thyroid condition' },
  diabetes: { title: 'Diabetes' },
  smoking: { title: 'Smoking' },
  alcohol: { title: 'Heavy alcohol' },
  tryDuration: { title: 'Time trying to conceive' },
  tryingStatus: { title: 'Current fertility goal' },
  intercourseTiming: { title: 'Intercourse timing while trying' },
  partnerSperm: { title: 'Partner sperm factor' },
  pregnancyLosses: { title: 'Pregnancy losses' },
  ectopicPregnancy: { title: 'Previous ectopic pregnancy' },
  stiHistory: { title: 'STI history' },
  pelvicSurgery: { title: 'Previous pelvic surgery' },
  uterineHistory: { title: 'Fibroid, uterine surgery, or uterine abnormality' },
  tbHistory: { title: 'Tuberculosis history' },
  tbTreatment: { title: 'Tuberculosis treatment' },
  familyEarlyMenopause: { title: 'Family history of early menopause' },
  recreationalDrugs: { title: 'Recreational drug use' },
  caffeine: { title: 'Caffeine intake' },
  cancerTreatment: { title: 'Cancer treatment history' }
};

function classifyRiskFactor(factor, value) {
  const num = Number(value);

  switch (factor) {
    case 'age':
      if (num < 30) return band('green', 'Under 30');
      if (num <= 34) return band('amber', 'Age 30-34');
      if (num <= 37) return band('amber', 'Age 35-37');
      if (num <= 40) return band('red', 'Age 38-40');
      return band('red', 'Age over 40');
    case 'bmi':
      if (num >= 18.5 && num <= 24.9) return band('green', 'BMI 18.5-24.9');
      if ((num >= 25 && num <= 29.9) || (num >= 17 && num < 18.5)) {
        return band('amber', 'BMI outside the optimal range');
      }
      return band('red', 'BMI in a high-risk range');
    case 'prevBirth':
      return value === 'yes' ? band('green', 'Previous live birth') : band('amber', 'No previous live birth');
    case 'cycleReg':
      return value === 'regular' ? band('green', 'Regular cycles') : band('red', 'Irregular or absent cycles');
    case 'cycleLength':
      if (value === 'normal') return band('green', 'Cycle length 21-35 days');
      if (value === 'short') return band('amber', 'Cycle length under 21 days');
      if (value === 'long') return band('red', 'Cycle length over 35 days');
      if (value === 'absent') return band('red', 'Absent periods');
      return band('amber', 'Cycle length not sure');
    case 'pcos':
      if (value === 'yes') return band('red', 'PCOS diagnosis');
      if (value === 'notSure') return band('amber', 'PCOS status not sure');
      return band('green', 'No PCOS diagnosis');
    case 'endo':
      if (value === 'yes') return band('red', 'Endometriosis diagnosis');
      if (value === 'notSure') return band('amber', 'Endometriosis status not sure');
      return band('green', 'No endometriosis diagnosis');
    case 'pelvicPain':
      if (value === 'none') return band('green', 'No significant painful periods or pelvic pain');
      if (value === 'mild') return band('amber', 'Painful periods or pelvic pain');
      return band('red', 'Severe painful periods or deep pelvic pain');
    case 'thyroid':
      if (value === 'no') return band('green', 'No thyroid condition');
      if (value === 'treated') return band('amber', 'Treated thyroid condition');
      if (value === 'untreated') return band('red', 'Untreated thyroid condition');
      return band('amber', 'Thyroid status not sure');
    case 'diabetes':
      if (value === 'no') return band('green', 'No diabetes diagnosis');
      if (value === 'controlled') return band('amber', 'Diabetes, well controlled');
      if (value === 'uncontrolled') return band('red', 'Diabetes not well controlled');
      return band('amber', 'Diabetes status not sure');
    case 'smoking':
      if (value === 'no') return band('green', 'No current smoking');
      if (value === 'occasional') return band('amber', 'Occasional smoking or tobacco use');
      return band('red', 'Daily smoking or tobacco use');
    case 'alcohol':
      if (value === 'yes') return band('red', 'More than 7 alcoholic drinks per week');
      if (value === 'notSure') return band('amber', 'Alcohol intake not sure');
      return band('green', 'Low or no alcohol');
    case 'tryDuration':
      if (value === 'notTrying') return band('green', 'Not currently trying');
      if (value === 'under6') return band('green', 'Trying for less than 6 months');
      if (value === 'sixToEleven') return band('amber', 'Trying for 6-11 months');
      return band('red', 'Trying to conceive for 12 months or longer');
    case 'tryingStatus':
      if (value === 'active') return band('green', 'Actively trying now');
      if (value === 'planning') return band('green', 'Planning a future pregnancy');
      return band('green', 'Checking fertility awareness');
    case 'intercourseTiming':
      if (value === 'notTrying') return band('green', 'Not currently trying');
      if (value === 'wellTimed') return band('green', 'Regular intercourse during the fertile window');
      if (value === 'infrequent') return band('amber', 'Intercourse may be too infrequent while trying');
      return band('amber', 'Fertile-window timing is uncertain');
    case 'partnerSperm':
      if (value === 'yes') return band('red', 'Known partner sperm factor');
      if (value === 'unknown') return band('amber', 'Partner sperm factor unknown');
      return band('green', 'No known partner sperm factor');
    case 'pregnancyLosses':
      if (value === 'none') return band('green', 'No pregnancy losses');
      if (value === 'one') return band('amber', 'One pregnancy loss');
      return band('red', 'Two or more pregnancy losses');
    case 'ectopicPregnancy':
      return value === 'yes' ? band('red', 'Previous ectopic pregnancy') : band('green', 'No previous ectopic pregnancy');
    case 'stiHistory':
      if (value === 'yes') return band('red', 'History of an STI that can affect fertility');
      if (value === 'notSure') return band('amber', 'STI history not sure');
      return band('green', 'No known STI history');
    case 'pelvicSurgery':
      if (value === 'yes') return band('red', 'Previous pelvic or abdominal surgery');
      if (value === 'notSure') return band('amber', 'Pelvic surgery history not sure');
      return band('green', 'No previous pelvic surgery');
    case 'uterineHistory':
      if (value === 'yes') return band('red', 'Fibroid, uterine surgery, or known uterine abnormality');
      if (value === 'notSure') return band('amber', 'Uterine history not sure');
      return band('green', 'No known uterine factor');
    case 'tbHistory':
      if (value === 'pelvic') return band('red', 'History of abdominal, pelvic, or genital TB');
      if (value === 'pulmonary') return band('amber', 'History of pulmonary TB');
      if (value === 'notSure') return band('amber', 'TB history not sure');
      return band('green', 'No TB history');
    case 'tbTreatment':
      if (value === 'current') return band('red', 'Currently on TB treatment');
      if (value === 'completed') return band('amber', 'Completed TB treatment');
      if (value === 'notSure') return band('amber', 'TB treatment history not sure');
      return band('green', 'No TB treatment history');
    case 'familyEarlyMenopause':
      if (value === 'yes') return band('red', 'Family history of menopause before 45');
      if (value === 'notSure') return band('amber', 'Family early menopause history not sure');
      return band('green', 'No family history of early menopause');
    case 'recreationalDrugs':
      if (value === 'no') return band('green', 'No recreational or non-prescribed drug use');
      if (value === 'occasional') return band('amber', 'Occasional recreational or non-prescribed drug use');
      return band('red', 'Regular recreational or non-prescribed drug use');
    case 'caffeine':
      if (value === 'high') return band('amber', 'More than 200 mg caffeine per day');
      if (value === 'notSure') return band('amber', 'Caffeine intake not sure');
      return band('green', 'Low to moderate caffeine');
    case 'cancerTreatment':
      if (value === 'yes') return band('red', 'History of chemotherapy or radiation');
      if (value === 'notSure') return band('amber', 'Cancer treatment history not sure');
      return band('green', 'No chemotherapy or radiation history');
    default:
      return band('green', '');
  }
}

function band(level, label) {
  return { level, label };
}

function buildFactors(data) {
  return {
    age: Number(data.age),
    bmi: Number(data.bmi),
    prevBirth: data.prevBirth,
    cycleReg: data.cycleReg,
    cycleLength: data.cycleLength,
    pcos: data.pcos,
    endo: data.endo,
    pelvicPain: data.pelvicPain,
    thyroid: data.thyroid,
    diabetes: data.diabetes,
    smoking: data.smoking,
    alcohol: data.alcohol,
    tryDuration: data.tryDuration,
    tryingStatus: data.tryingStatus,
    intercourseTiming: data.intercourseTiming,
    partnerSperm: data.partnerSperm,
    pregnancyLosses: data.pregnancyLosses,
    ectopicPregnancy: data.ectopicPregnancy,
    stiHistory: data.stiHistory,
    pelvicSurgery: data.pelvicSurgery,
    uterineHistory: data.uterineHistory,
    tbHistory: data.tbHistory,
    tbTreatment: data.tbTreatment,
    familyEarlyMenopause: data.familyEarlyMenopause,
    recreationalDrugs: data.recreationalDrugs,
    caffeine: data.caffeine,
    cancerTreatment: data.cancerTreatment
  };
}

function assessRisk(factors) {
  const results = Object.entries(factors).map(([key, value]) => {
    const result = classifyRiskFactor(key, value);
    return { key, title: factorDefinitions[key]?.title || key, value, ...result };
  });
  const redCount = results.filter((item) => item.level === 'red').length;
  const amberCount = results.filter((item) => item.level === 'amber').length;
  const weighted = calculateWeightedRisk(factors);
  const triggers = getImmediateReferralTriggers(factors);
  let category = 'low';

  if (triggers.length > 0 || weighted.total >= 7 || (Number(factors.age) >= 38 && weighted.strongRiskCount > 0)) {
    category = 'high';
  } else if (weighted.total >= 3 || Number(factors.age) >= 35 || weighted.mildModerateCount >= 2) {
    category = 'medium';
  }

  return {
    category,
    redCount,
    amberCount,
    results,
    weightedTotal: weighted.total,
    weightedItems: weighted.items,
    referralTriggers: triggers,
    referralUrgency: getReferralUrgency(category, triggers)
  };
}

function calculateWeightedRisk(factors) {
  const age = Number(factors.age);
  const bmi = Number(factors.bmi);
  const items = [];

  if (age >= 30 && age <= 34) addWeight(items, 'age', 1, 'Age 30-34');
  else if (age >= 35 && age <= 37) addWeight(items, 'age', 2, 'Age 35-37');
  else if (age >= 38 && age <= 40) addWeight(items, 'age', 3, 'Age 38-40');
  else if (age > 40) addWeight(items, 'age', 4, 'Age over 40');

  if ((bmi >= 25 && bmi <= 29.9) || (bmi >= 17 && bmi < 18.5)) {
    addWeight(items, 'bmi', 1, 'BMI outside the optimal range');
  } else if (bmi < 17 || bmi >= 30) {
    addWeight(items, 'bmi', 2, 'BMI in a high-risk range');
  }

  if (factors.prevBirth === 'yes') addWeight(items, 'prevBirth', -1, 'Previous live birth');
  else addWeight(items, 'prevBirth', 1, 'No previous live birth');

  if (factors.cycleReg === 'irregular') addWeight(items, 'cycleReg', 4, 'Irregular or absent cycles');
  if (factors.cycleLength === 'short') addWeight(items, 'cycleLength', 1, 'Cycle length under 21 days');
  if (factors.cycleLength === 'long') addWeight(items, 'cycleLength', 3, 'Cycle length over 35 days');
  if (factors.cycleLength === 'absent') addWeight(items, 'cycleLength', 4, 'Absent periods');
  if (factors.cycleLength === 'notSure') addWeight(items, 'cycleLength', 1, 'Cycle length not sure');
  if (factors.pcos === 'yes') addWeight(items, 'pcos', 3, 'PCOS diagnosis');
  if (factors.pcos === 'notSure') addWeight(items, 'pcos', 1, 'PCOS status not sure');
  if (factors.endo === 'yes') addWeight(items, 'endo', 3, 'Endometriosis diagnosis');
  if (factors.endo === 'notSure') addWeight(items, 'endo', 1, 'Endometriosis status not sure');
  if (factors.pelvicPain === 'mild') addWeight(items, 'pelvicPain', 1, 'Painful periods or pelvic pain');
  if (factors.pelvicPain === 'severe') addWeight(items, 'pelvicPain', 3, 'Severe painful periods or deep pelvic pain');
  if (factors.thyroid === 'treated') addWeight(items, 'thyroid', 1, 'Treated thyroid condition');
  if (factors.thyroid === 'untreated') addWeight(items, 'thyroid', 3, 'Untreated thyroid condition');
  if (factors.thyroid === 'notSure') addWeight(items, 'thyroid', 1, 'Thyroid status not sure');
  if (factors.diabetes === 'controlled') addWeight(items, 'diabetes', 1, 'Diabetes, well controlled');
  if (factors.diabetes === 'uncontrolled') addWeight(items, 'diabetes', 3, 'Diabetes not well controlled');
  if (factors.diabetes === 'notSure') addWeight(items, 'diabetes', 1, 'Diabetes status not sure');
  if (factors.smoking === 'occasional') addWeight(items, 'smoking', 1, 'Occasional smoking or tobacco use');
  if (factors.smoking === 'daily') addWeight(items, 'smoking', 2, 'Daily smoking or tobacco use');
  if (factors.alcohol === 'yes') addWeight(items, 'alcohol', 2, 'More than 7 alcoholic drinks per week');
  if (factors.alcohol === 'notSure') addWeight(items, 'alcohol', 1, 'Alcohol intake not sure');

  if (factors.tryDuration === 'sixToEleven' && age >= 35 && factors.tryingStatus === 'active') {
    addWeight(items, 'tryDuration', 2, 'Trying 6-11 months at age 35 or older');
  } else if (factors.tryDuration === 'sixToEleven' && factors.tryingStatus === 'active') {
    addWeight(items, 'tryDuration', 1, 'Trying for 6-11 months');
  } else if (factors.tryDuration === 'over12' && factors.tryingStatus === 'active') {
    addWeight(items, 'tryDuration', 4, 'Trying to conceive for 12 months or longer');
  }

  if (factors.intercourseTiming === 'infrequent') addWeight(items, 'intercourseTiming', 1, 'Intercourse may be too infrequent while trying');
  if (factors.intercourseTiming === 'uncertain') addWeight(items, 'intercourseTiming', 1, 'Fertile-window timing is uncertain');
  if (factors.partnerSperm === 'unknown') addWeight(items, 'partnerSperm', 1, 'Partner sperm factor unknown');
  if (factors.partnerSperm === 'yes') addWeight(items, 'partnerSperm', 4, 'Known partner sperm factor');
  if (factors.pregnancyLosses === 'one') addWeight(items, 'pregnancyLosses', 1, 'One pregnancy loss');
  if (factors.pregnancyLosses === 'twoPlus') addWeight(items, 'pregnancyLosses', 3, 'Two or more pregnancy losses');
  if (factors.ectopicPregnancy === 'yes') addWeight(items, 'ectopicPregnancy', 3, 'Previous ectopic pregnancy');
  if (factors.stiHistory === 'yes') addWeight(items, 'stiHistory', 3, 'History of an STI that can affect fertility');
  if (factors.stiHistory === 'notSure') addWeight(items, 'stiHistory', 1, 'STI history not sure');
  if (factors.pelvicSurgery === 'yes') addWeight(items, 'pelvicSurgery', 3, 'Previous pelvic surgery');
  if (factors.pelvicSurgery === 'notSure') addWeight(items, 'pelvicSurgery', 1, 'Pelvic surgery history not sure');
  if (factors.uterineHistory === 'yes') addWeight(items, 'uterineHistory', 3, 'Fibroid, uterine surgery, or known uterine abnormality');
  if (factors.uterineHistory === 'notSure') addWeight(items, 'uterineHistory', 1, 'Uterine history not sure');
  if (factors.tbHistory === 'pulmonary') addWeight(items, 'tbHistory', 1, 'History of pulmonary TB');
  if (factors.tbHistory === 'pelvic') addWeight(items, 'tbHistory', 4, 'History of abdominal, pelvic, or genital TB');
  if (factors.tbHistory === 'notSure') addWeight(items, 'tbHistory', 1, 'TB history not sure');
  if (factors.tbTreatment === 'completed') addWeight(items, 'tbTreatment', 1, 'Completed TB treatment');
  if (factors.tbTreatment === 'current') addWeight(items, 'tbTreatment', 4, 'Currently on TB treatment');
  if (factors.tbTreatment === 'notSure') addWeight(items, 'tbTreatment', 1, 'TB treatment history not sure');
  if (factors.familyEarlyMenopause === 'yes') addWeight(items, 'familyEarlyMenopause', 3, 'Family history of menopause before 45');
  if (factors.familyEarlyMenopause === 'notSure') addWeight(items, 'familyEarlyMenopause', 1, 'Family early menopause history not sure');
  if (factors.recreationalDrugs === 'occasional') addWeight(items, 'recreationalDrugs', 1, 'Occasional recreational or non-prescribed drug use');
  if (factors.recreationalDrugs === 'regular') addWeight(items, 'recreationalDrugs', 2, 'Regular recreational or non-prescribed drug use');
  if (factors.caffeine === 'high') addWeight(items, 'caffeine', 1, 'More than 200 mg caffeine per day');
  if (factors.caffeine === 'notSure') addWeight(items, 'caffeine', 1, 'Caffeine intake not sure');
  if (factors.cancerTreatment === 'yes') addWeight(items, 'cancerTreatment', 4, 'History of chemotherapy or radiation');
  if (factors.cancerTreatment === 'notSure') addWeight(items, 'cancerTreatment', 1, 'Cancer treatment history not sure');

  const rawTotal = items.reduce((sum, item) => sum + item.weight, 0);
  const total = Math.max(0, rawTotal);
  const strongRiskCount = items.filter((item) => item.weight >= 3).length;
  const mildModerateCount = items.filter((item) => item.weight >= 1 && item.weight <= 2).length;

  return { total, items, strongRiskCount, mildModerateCount };
}

function addWeight(items, key, weight, reason) {
  items.push({ key, weight, reason });
}

function getImmediateReferralTriggers(factors) {
  const age = Number(factors.age);
  const triggers = [];

  if (age >= 36 && factors.tryingStatus === 'active') {
    triggers.push('Age 36 or older while trying to conceive');
  }
  if (age > 40) {
    triggers.push('Age over 40');
  }
  if (factors.tryDuration === 'over12' && factors.tryingStatus === 'active') {
    triggers.push(age >= 35 ? 'Trying 12 months or longer at age 35 or older' : 'Trying 12 months or longer');
  }
  if (factors.tryDuration === 'sixToEleven' && age >= 35 && factors.tryingStatus === 'active') {
    triggers.push('Age 35 or older: consider evaluation after 6 months of trying');
  }
  if (factors.cycleReg === 'irregular') {
    triggers.push('Irregular or absent menstrual cycles');
  }
  if (factors.cycleLength === 'long' || factors.cycleLength === 'absent') {
    triggers.push('Cycle length suggests possible ovulatory dysfunction');
  }
  if (factors.endo === 'yes') {
    triggers.push('Endometriosis diagnosis');
  }
  if (factors.pelvicPain === 'severe') {
    triggers.push('Severe painful periods or deep pelvic pain');
  }
  if (factors.partnerSperm === 'yes') {
    triggers.push('Known partner sperm factor');
  }
  if (factors.pregnancyLosses === 'twoPlus') {
    triggers.push('Two or more pregnancy losses');
  }
  if (factors.ectopicPregnancy === 'yes') {
    triggers.push('Previous ectopic pregnancy');
  }
  if (factors.stiHistory === 'yes') {
    triggers.push('STI history with possible tubal risk');
  }
  if (factors.pelvicSurgery === 'yes') {
    triggers.push('Prior pelvic surgery with possible pelvic or tubal adhesions');
  }
  if (factors.uterineHistory === 'yes') {
    triggers.push('Known fibroid, uterine surgery, or uterine abnormality');
  }
  if (factors.tbHistory === 'pelvic' || factors.tbTreatment === 'current') {
    triggers.push('History of abdominal, pelvic, or genital TB, or current TB treatment');
  }
  if (factors.thyroid === 'untreated') {
    triggers.push('Untreated thyroid condition');
  }
  if (factors.diabetes === 'uncontrolled') {
    triggers.push('Diabetes not well controlled');
  }
  if (factors.cancerTreatment === 'yes') {
    triggers.push('History of chemotherapy or radiation');
  }

  return [...new Set(triggers)];
}

function getReferralUrgency(category, triggers) {
  if (category === 'high' && triggers.length > 0) return 'Specialist consultation advised now';
  if (category === 'high') return 'Specialist consultation strongly recommended';
  if (category === 'medium') return 'Consider specialist advice or review within 3-6 months';
  return 'Routine preconception guidance; seek care if concerns persist';
}

function normalizeAmhToNgMl(value, unit) {
  const amh = Number(value);
  if (!Number.isFinite(amh)) return null;
  return unit === 'pmol/L' ? amh / AMH_PMOL_PER_NG : amh;
}

function assessOvarianReserve(amhValue, amhUnit, fshValue, afcValue) {
  const amh = normalizeAmhToNgMl(amhValue, amhUnit);
  const fsh = Number(fshValue);
  const afc = Number(afcValue);
  if (![amh, fsh, afc].every(Number.isFinite)) return null;

  const severe = amh < 0.5 || fsh >= 10.5 || afc <= 5;
  const moderate = (amh >= 0.5 && amh < 1.0) || (fsh >= 8.5 && fsh < 10.5) || (afc > 5 && afc <= 7);
  const mild = (amh >= 1.0 && amh < 2.0) || (fsh >= 6.5 && fsh < 8.5) || (afc > 7 && afc <= 10);

  if (severe) return { cluster: 'D', reserve: 'severely reduced', amhNgMl: amh };
  if (moderate) return { cluster: 'C', reserve: 'moderately reduced', amhNgMl: amh };
  if (mild) return { cluster: 'B', reserve: 'mildly reduced', amhNgMl: amh };
  return { cluster: 'A', reserve: 'adequate', amhNgMl: amh };
}

const factorDetails = {
  age: 'Age affects both the number of remaining eggs and the proportion of eggs with normal chromosomes. This is why age strongly influences natural conception and IVF counselling.',
  bmi: 'BMI outside the optimal range can affect ovulation, hormone balance, pregnancy risks, and response to fertility treatment.',
  prevBirth: 'No previous live birth does not mean infertility, but it means there is no prior proven live-birth history to offset other risk signals.',
  tryDuration: 'Time trying to conceive is one of the most important triage signals. Referral timing is usually earlier as age increases.',
  intercourseTiming: 'Conception chances depend partly on intercourse in the fertile window. Timing uncertainty is common and often correctable.',
  partnerSperm: 'Male-factor fertility issues are common and should be assessed in parallel rather than after all female investigations are complete.',
  cycleReg: 'Irregular or absent cycles can suggest inconsistent ovulation and may need targeted hormonal evaluation.',
  cycleLength: 'Very short, long, absent, or uncertain cycles can point toward ovulatory dysfunction or hormonal imbalance.',
  pcos: 'PCOS can affect ovulation and cycle regularity, but many people with PCOS conceive with appropriate management.',
  thyroid: 'Thyroid imbalance can affect ovulation, miscarriage risk, and pregnancy health. Control before conception is important.',
  diabetes: 'Diabetes can affect ovulation, miscarriage risk, and pregnancy outcomes, especially when blood sugar is not well controlled.',
  familyEarlyMenopause: 'A family history of early menopause can suggest earlier ovarian reserve decline in some people.',
  pregnancyLosses: 'Repeated pregnancy losses deserve specialist review because causes can include uterine, genetic, endocrine, immune, or clotting factors.',
  ectopicPregnancy: 'A previous ectopic pregnancy can be associated with tubal damage and may influence investigation choices.',
  endo: 'Endometriosis can affect fertility through inflammation, adhesions, ovarian cysts, and altered pelvic anatomy.',
  pelvicPain: 'Severe period pain, pain during sex, or deep pelvic pain can be a clue to endometriosis or pelvic inflammation.',
  uterineHistory: 'Fibroids, uterine surgery, or uterine anomalies can affect implantation, miscarriage risk, or pregnancy carrying capacity.',
  pelvicSurgery: 'Pelvic or abdominal surgery can sometimes create adhesions near the ovaries, uterus, or fallopian tubes.',
  stiHistory: 'Some sexually transmitted infections can affect the fallopian tubes even after treatment, so tubal assessment may be relevant.',
  tbHistory: 'Tuberculosis involving the abdomen, pelvis, or genital tract can affect the fallopian tubes or uterine lining.',
  tbTreatment: 'Current or previous TB treatment matters for pregnancy planning and for deciding whether infectious disease review is needed.',
  cancerTreatment: 'Chemotherapy or radiation can reduce ovarian reserve or affect reproductive organs, depending on treatment type and dose.',
  smoking: 'Smoking can affect ovarian reserve, egg quality, miscarriage risk, and IVF outcomes.',
  caffeine: 'Caffeine risk is usually dose-related. Staying at or below moderate intake is commonly advised while trying to conceive.',
  alcohol: 'Higher alcohol intake may affect fecundability and pregnancy safety, so reduction is usually recommended while trying.',
  recreationalDrugs: 'Recreational or non-prescribed drugs may affect ovulation, hormones, pregnancy safety, and treatment planning.'
};



export function assessFertilityPayload(data = {}) {
  const risk = assessRisk(buildFactors(data));
  const ovarianReserve = data.includeLab === 'yes'
    ? assessOvarianReserve(data.amhValue, data.amhUnit, data.fsh, data.afc)
    : null;
  const flaggedFactors = risk.results
    .filter((item) => item.level !== 'green')
    .map((item) => ({
      key: item.key,
      title: item.title,
      value: item.value,
      level: item.level,
      label: item.label,
      detail: factorDetails[item.key] || 'This factor can be useful context for a fertility specialist.'
    }));

  return {
    category: risk.category,
    redCount: risk.redCount,
    amberCount: risk.amberCount,
    referralUrgency: risk.referralUrgency,
    referralTriggers: risk.referralTriggers,
    flaggedFactors,
    ovarianReserve,
    recommendation: getRecommendation(risk.category),
    detailedMeaning: getDetailedMeaning(risk.category)
  };
}

function getDetailedMeaning(category) {
  if (category === 'high') {
    return 'The answers include one or more factors that commonly justify timely fertility specialist review. This does not diagnose infertility, but it suggests that waiting without evaluation may not be the best next step.';
  }
  if (category === 'medium') {
    return 'The answers show some cautionary factors. Many are modifiable or treatable, but a clinician can help decide whether evaluation should happen now or after a short period of trying.';
  }
  return 'The answers suggest a lower risk profile based on the information provided. This does not guarantee pregnancy, but it supports routine preconception guidance unless concerns arise.';
}

function getRecommendation(category) {
  if (category === 'high') return 'Prompt fertility specialist consultation is advised.';
  if (category === 'medium') return 'Consider targeted lifestyle changes and specialist advice, especially if conception does not occur soon.';
  return 'Your answers suggest a lower risk profile. Continue healthy preconception habits and seek care if you have concerns.';
}
