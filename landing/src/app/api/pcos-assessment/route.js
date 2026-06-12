import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // 1. Initialize scoring
    let score = 0;
    const contributingFactors = [];

    // Step 2: Menstrual Dysfunction (Max 35 points)
    let menstrualScore = 0;
    if (data.cycleLength === 'irregular') {
      menstrualScore += 15;
      contributingFactors.push("Irregular cycle length (36-45 days)");
    } else if (data.cycleLength === 'highlyIrregular') {
      menstrualScore += 25;
      contributingFactors.push("Highly irregular or absent cycles (>45 days)");
    }

    if (data.periodsPerYear === 'eightOrFewer') {
      menstrualScore += 10;
      if (!contributingFactors.includes("Highly irregular or absent cycles (>45 days)")) {
        contributingFactors.push("Infrequent periods (8 or fewer per year)");
      }
    }
    score += Math.min(menstrualScore, 35);

    // Step 3: Hyperandrogenism (Max 30 points)
    let androgenScore = 0;
    if (data.facialHair === 'mild') {
      androgenScore += 10;
      contributingFactors.push("Mild to moderate unwanted hair growth");
    } else if (data.facialHair === 'severe') {
      androgenScore += 15;
      contributingFactors.push("Severe unwanted hair growth");
    }

    if (data.acne === 'mild') {
      androgenScore += 3;
    } else if (data.acne === 'severe') {
      androgenScore += 10;
      contributingFactors.push("Moderate to severe or cystic acne");
    }

    if (data.hairThinning === 'mild') {
      androgenScore += 5;
      contributingFactors.push("Noticeable hair thinning");
    }
    score += Math.min(androgenScore, 30);

    // Step 4: Metabolic Domain (Max 20 points)
    let metabolicScore = 0;
    const bmi = Number(data.bmi);
    if (bmi >= 23 && bmi <= 24.9) {
      metabolicScore += 5;
    } else if (bmi >= 25) {
      metabolicScore += 8;
      contributingFactors.push("Elevated BMI (Obese category by Asian cut-offs)");
    }

    if (data.waist === 'high') {
      metabolicScore += 7;
      contributingFactors.push("Increased waist circumference (>= 80 cm / 31.5 inches)");
    }

    if (data.acanthosis === 'yes') {
      metabolicScore += 5;
      contributingFactors.push("Presence of Acanthosis Nigricans (dark velvety skin patches)");
    }
    score += Math.min(metabolicScore, 20);

    // Step 5: Family History (Max 10 points)
    let familyScore = 0;
    if (data.familyPcos === 'yes') {
      familyScore += 6;
      contributingFactors.push("Family history of PCOS");
    }
    if (data.familyDiabetes === 'yes') {
      familyScore += 4;
      contributingFactors.push("Family history of Diabetes");
    }
    score += Math.min(familyScore, 10);

    // Step 6: Fertility (Max 5 points)
    let fertilityScore = 0;
    if (data.tryingDuration === 'sixToTwelve') {
      fertilityScore += 2;
    } else if (data.tryingDuration === 'overTwelve') {
      fertilityScore += 5;
      contributingFactors.push("Trying to conceive for more than 12 months without success");
    }
    score += Math.min(fertilityScore, 5);

    // Score Categories & Percentile
    let category = "Low Pattern Match";
    
    if (score >= 75) {
      category = "Very High Pattern Match";
    } else if (score >= 50) {
      category = "High Pattern Match";
    } else if (score >= 25) {
      category = "Moderate Pattern Match";
    }

    // Deterministic percentile for emotional context
    const percentile = Math.min(99, Math.round(score * 1.3 + 15));

    // Specific Boolean Patterns
    const patterns = {
      ovulatory: menstrualScore > 0,
      metabolic: metabolicScore >= 8 || bmi >= 25,
      androgen: androgenScore >= 10,
      leanPcos: score >= 40 && bmi < 23 && data.waist === 'normal',
      lowSymptom: score < 25
    };

    let dominantPatternText = "Your responses span multiple domains without a strongly dominant symptom cluster.";
    if (patterns.leanPcos) {
      dominantPatternText = "Lean PCOS Pattern: You have a high risk profile despite having a normal BMI. Lean PCOS can still involve hidden insulin resistance or high adrenal androgens.";
    } else if (patterns.metabolic && !patterns.androgen) {
      dominantPatternText = "Predominantly Metabolic Pattern: Your symptoms suggest that metabolic factors and insulin resistance may be strongly driving your hormonal imbalances.";
    } else if (patterns.androgen && !patterns.metabolic) {
      dominantPatternText = "Predominantly Androgen Excess Pattern: High levels of androgen (male hormones) appear to be a primary factor for you, leading to physical symptoms.";
    } else if (patterns.ovulatory && patterns.metabolic && patterns.androgen) {
      dominantPatternText = "Classic Polycystic Ovary Syndrome Pattern: Your symptoms align across all three major diagnostic criteria domains (ovulatory, metabolic, and androgenic).";
    } else if (patterns.lowSymptom) {
      dominantPatternText = "Low Symptom Burden Pattern: You do not exhibit a strong cluster of PCOS-related symptoms based on your responses.";
    }

    // What This Means
    const whatThisMeans = [
      "Irregular ovulation",
      "Difficulty conceiving",
      "Weight management challenges",
      "Insulin resistance",
      "Long-term metabolic health"
    ];

    // Fertility Impact
    let fertilityImpact = "Some symptoms reported can be associated with irregular ovulation. This does NOT mean infertility. Many women with similar patterns conceive naturally or with targeted treatment.";
    if (data.tryingDuration === 'notTrying') {
      fertilityImpact = "While you are not currently trying to conceive, some of the reported symptoms can be associated with irregular ovulation. Understanding your body now is beneficial for future family planning.";
    }

    // 30-Day Action Plan
    const actionPlan = [
      { week: "Week 1", task: "Start tracking cycle dates and symptoms." },
      { week: "Week 2", task: "Schedule a gynecologist or endocrinologist consultation." },
      { week: "Week 3", task: "Discuss whether hormone and metabolic testing may be appropriate." },
      { week: "Week 4", task: "Review lifestyle modifications and reassess personal health goals." }
    ];

    // Suggested Investigations
    const suggestedTests = [
      "Pelvic Ultrasound",
      "Total & Free Testosterone",
      "TSH (Thyroid)",
      "Prolactin",
      "HbA1c & Fasting Insulin",
      "Lipid Profile"
    ];

    const domainScores = {
      menstrual: Math.min(menstrualScore, 35),
      androgen: Math.min(androgenScore, 30),
      metabolic: Math.min(metabolicScore, 20),
      familyFertility: Math.min(familyScore + fertilityScore, 15)
    };

    return NextResponse.json({
      success: true,
      assessment: {
        score,
        percentile,
        category,
        patterns,
        domainScores,
        dominantPatternText,
        contributingFactors,
        whatThisMeans,
        fertilityImpact,
        actionPlan,
        suggestedTests
      }
    });
  } catch (error) {
    console.error("PCOS Assessment API Error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to process assessment' },
      { status: 500 }
    );
  }
}
