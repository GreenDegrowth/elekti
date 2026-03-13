import {
  encodeAnswerValuesToBase64Url,
  UNANSWERED_VALUE,
} from "../validators/answers";

export function makeEncodedAnswers(
  values: Array<number | undefined>,
  total: number
): string {
  const padded = Array.from({ length: total }, (_, index) => {
    const value = values[index];
    return value === undefined ? UNANSWERED_VALUE : value;
  });
  return encodeAnswerValuesToBase64Url(padded);
}
