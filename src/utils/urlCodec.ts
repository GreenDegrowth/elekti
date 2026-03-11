import {
  decodeAndValidateAnswers,
  encodeAnswerValuesToBase64Url,
  UNANSWERED_VALUE,
} from "../validators/answers";

export interface UrlDecodeResult {
  success: boolean;
  answers?: Record<string, number>;
  restoredCount?: number;
  error?: string;
}

export function encodeAnswers(
  questions: { id: string }[],
  answers: Record<string, number>
): string {
  const values = questions.map((q) => {
    const answer = answers[q.id];
    return answer === undefined ? UNANSWERED_VALUE : answer;
  });
  return encodeAnswerValuesToBase64Url(values);
}

export function decodeAnswersFromUrl(
  encoded: string,
  questionIds: string[],
  availableQuestionIds: string[]
): UrlDecodeResult {
  if (!encoded) {
    return { success: false, error: "No encoded answers provided" };
  }

  try {
    const availableSet = new Set(availableQuestionIds);
    const invalidIds = questionIds.filter((id) => !availableSet.has(id));

    if (invalidIds.length > 0) {
      return {
        success: false,
        error: `Question ids not present in current survey: ${invalidIds.join(", ")}`,
      };
    }

    if (questionIds.length === 0) {
      return { success: false, error: "No questions available to decode" };
    }

    const result = decodeAndValidateAnswers(encoded, questionIds);

    if (!result.success || !result.answers) {
      return {
        success: false,
        error: result.error || "Encoded answers could not be decoded",
      };
    }

    const allowedIds = new Set(questionIds);
    const filtered = Object.fromEntries(
      Object.entries(result.answers).filter(([id]) => allowedIds.has(id))
    );

    const restoredCount = Object.keys(filtered).length;

    if (restoredCount === 0) {
      return {
        success: false,
        error: "No valid answers found for the provided questions",
      };
    }

    return { success: true, answers: filtered, restoredCount };
  } catch {
    return { success: false, error: "Failed to load encoded answers" };
  }
}
