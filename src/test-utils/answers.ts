import {
  encodeAnswerValuesToBase64Url,
  UNANSWERED_VALUE,
} from "../validators/answers";

/**
 * Encode an array of answer values (with undefined for unanswered) into a
 * base64url string. Pads/truncates to `total` length.
 *
 * For use in unit tests only.
 */
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
