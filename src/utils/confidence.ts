import { SCORING } from "./constants";

export function determineConfidence(
  topScore: number,
  scoreSpread: number,
  answeredCount: number,
  totalQuestions: number
): "high" | "medium" | "low" {
  let confidence: "high" | "medium" | "low" = "high";

  if (topScore < SCORING.LOW_CONFIDENCE_THRESHOLD) {
    confidence = "low";
  } else if (
    topScore < SCORING.MEDIUM_CONFIDENCE_THRESHOLD ||
    scoreSpread < SCORING.SPREAD_THRESHOLD
  ) {
    confidence = "medium";
  }

  const answerRate = answeredCount / totalQuestions;
  if (answerRate < 0.2 && confidence === "high") {
    confidence = "medium";
  }

  return confidence;
}
