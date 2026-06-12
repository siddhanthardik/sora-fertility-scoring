import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // 1. Initialize scoring
    let score = 0;
    const contributingFactors = [];
    const patternInsights = [];

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

    // Score Categories
    let category = "Low likelihood";
    let explanation = "Your responses do not indicate a high risk for PCOS. However, if you have concerns about your menstrual cycle or fertility, a routine check-up is always a good idea.";
    let nextSteps = "Maintain a healthy lifestyle. If you are actively trying to conceive and face issues, consult your doctor.";

    if (score >= 75) {
      category = "Very high likelihood";
      explanation = "Your responses strongly align with the clinical criteria for Polycystic Ovary Syndrome (PCOS). You exhibit multiple key symptoms such as irregular cycles, androgenic signs, or metabolic indicators.";
      nextSteps = "We highly recommend scheduling a consultation with a reproductive endocrinologist or gynecologist for a formal evaluation, ultrasound, and hormone panel.";
    } else if (score >= 50) {
      category = "High likelihood";
      explanation = "Your responses indicate a significant number of PCOS-related symptoms. A clinical evaluation is recommended to confirm a diagnosis.";
      nextSteps = "Schedule a visit with your doctor. They can perform blood tests (like testosterone, AMH, and metabolic markers) and a pelvic ultrasound to provide clarity.";
    } else if (score >= 25) {
      category = "Moderate likelihood";
      explanation = "You have some symptoms that could be associated with PCOS, but they may also be related to other hormonal or lifestyle factors.";
      nextSteps = "Discuss these symptoms at your next routine gynecological visit. Tracking your cycle lengths and symptoms will be helpful for your doctor.";
    }

    // Pattern Insights
    if (metabolicScore >= 15 && menstrualScore > 0) {
      patternInsights.push("Insulin Resistance Pattern: Your symptoms suggest that metabolic factors and insulin resistance may be strongly driving your hormonal imbalances. Focus on blood sugar management and discuss Metformin or Inositol with your doctor.");
    }
    if (androgenScore >= 20) {
      patternInsights.push("Hyperandrogenic Pattern: High levels of androgen (male hormones) appear to be a primary factor for you, leading to physical symptoms like acne or hair growth. Specific anti-androgen treatments may be beneficial.");
    }
    if (score >= 50 && bmi < 23 && data.waist === 'normal') {
      patternInsights.push("Lean PCOS Pattern: You have a high risk profile despite having a normal BMI. Lean PCOS can still involve hidden insulin resistance or high adrenal androgens, and requires careful management.");
    }

    return NextResponse.json({
      success: true,
      assessment: {
        score,
        category,
        explanation,
        nextSteps,
        contributingFactors,
        patternInsights
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
