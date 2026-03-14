export interface PerformanceMetrics {
  age: number;
  pushUps: number;
  pullUps: number;
  sprints: number;
  mileMin: number;
  mileSec: number;
  gripStrength?: number;
  waist: number;
  hangMin: number;
  hangSec: number;
  rhr: number;
}

export interface FitnessScores {
  overall: number;
  strength: number;
  cardio: number;
  power: number;
  bodyComp: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function calculateScores(metrics: PerformanceMetrics): FitnessScores {
  // 1. STRENGTH
  const pushUpScore = clamp((metrics.pushUps / 60) * 100, 0, 100);
  const pullUpScore = clamp((metrics.pullUps / 25) * 100, 0, 100);
  
  const deadHangTotalSec = (metrics.hangMin * 60) + metrics.hangSec;
  const deadHangScore = clamp((deadHangTotalSec / 180) * 100, 0, 100);
  
  let strengthScore = 0;
  if (metrics.gripStrength && metrics.gripStrength > 0) {
    const gripScore = clamp((metrics.gripStrength / 150) * 100, 0, 100);
    strengthScore = (pushUpScore * 0.30) + (pullUpScore * 0.35) + (deadHangScore * 0.20) + (gripScore * 0.15);
  } else {
    strengthScore = (pushUpScore * 0.35) + (pullUpScore * 0.40) + (deadHangScore * 0.25);
  }

  // 2. CARDIO
  const mileTotalSec = (metrics.mileMin * 60) + metrics.mileSec;
  let mileScore = 0;
  if (mileTotalSec <= 360) mileScore = 100;
  else if (mileTotalSec >= 900) mileScore = 0;
  else mileScore = clamp(((900 - mileTotalSec) / (900 - 360)) * 100, 0, 100);

  let heartRateScore = 0;
  if (metrics.rhr <= 50) heartRateScore = 100;
  else if (metrics.rhr >= 100) heartRateScore = 0;
  else heartRateScore = clamp(((100 - metrics.rhr) / (100 - 50)) * 100, 0, 100);

  const cardioScore = (mileScore * 0.65) + (heartRateScore * 0.35);

  // 3. POWER / CONDITIONING
  const powerScore = clamp((metrics.sprints / 20) * 100, 0, 100);

  // 4. BODY COMPOSITION
  let waistScore = 0;
  if (metrics.waist <= 31) waistScore = 100;
  else if (metrics.waist >= 45) waistScore = 0;
  else waistScore = clamp(((45 - metrics.waist) / (45 - 31)) * 100, 0, 100);

  // 5. OVERALL
  const overallScore = (strengthScore * 0.35) + (cardioScore * 0.30) + (powerScore * 0.20) + (waistScore * 0.15);

  return {
    overall: Math.round(overallScore),
    strength: Math.round(strengthScore),
    cardio: Math.round(cardioScore),
    power: Math.round(powerScore),
    bodyComp: Math.round(waistScore),
  };
}

export function getInterpretationLabel(score: number): string {
  if (score >= 90) return "Elite";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Above Average";
  if (score >= 45) return "Average";
  if (score >= 30) return "Below Average";
  return "Needs Work";
}

export function generateOverallInterpretation(scores: FitnessScores): string {
  const categoryMap = {
    "Strength": scores.strength,
    "Cardiovascular": scores.cardio,
    "Power & Conditioning": scores.power,
    "Body Composition": scores.bodyComp
  };

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const highest = sortedCategories[0];
  const lowest = sortedCategories[3];

  const overallLabel = getInterpretationLabel(scores.overall).toLowerCase();

  return `Your performance indicates a ${overallLabel} level of fitness. You show incredible capability in your ${highest[0]} (scoring ${highest[1]}), highlighting a strong physical foundation. However, to build a more well-rounded and elite athletic profile, you should focus your upcoming training cycles on improving your ${lowest[0]} (scoring ${lowest[1]}). Keep pushing the limits.`;
}
