import { describe, expect, it } from "vitest";
import { SCORING } from "./constants";
import { determineConfidence } from "./confidence";

const { LOW_CONFIDENCE_THRESHOLD, MEDIUM_CONFIDENCE_THRESHOLD, SPREAD_THRESHOLD } =
  SCORING;

describe("determineConfidence", () => {
  describe("high confidence baseline", () => {
    it("returns high when topScore is well above medium threshold with good spread", () => {
      const result = determineConfidence(0.8, 0.2, 20, 30);
      expect(result).toBe("high");
    });
  });

  describe("low confidence threshold", () => {
    it("returns low when topScore is below LOW_CONFIDENCE_THRESHOLD", () => {
      const result = determineConfidence(
        LOW_CONFIDENCE_THRESHOLD - 0.01,
        0.2,
        20,
        30
      );
      expect(result).toBe("low");
    });

    it("returns low when topScore equals LOW_CONFIDENCE_THRESHOLD (exclusive)", () => {
      // topScore < threshold → low
      const result = determineConfidence(LOW_CONFIDENCE_THRESHOLD, 0.2, 20, 30);
      // 0.2 is NOT < 0.2 so this should be medium (spread OK, but topScore < MEDIUM)
      expect(result).toBe("medium");
    });

    it("returns low for zero topScore", () => {
      const result = determineConfidence(0, 0.2, 20, 30);
      expect(result).toBe("low");
    });
  });

  describe("medium confidence threshold", () => {
    it("returns medium when topScore is between LOW and MEDIUM thresholds", () => {
      const midScore =
        (LOW_CONFIDENCE_THRESHOLD + MEDIUM_CONFIDENCE_THRESHOLD) / 2;
      const result = determineConfidence(midScore, 0.2, 20, 30);
      expect(result).toBe("medium");
    });

    it("returns medium when spread is below SPREAD_THRESHOLD even with high topScore", () => {
      const result = determineConfidence(
        0.9,
        SPREAD_THRESHOLD - 0.01,
        20,
        30
      );
      expect(result).toBe("medium");
    });

    it("returns medium when spread exactly equals SPREAD_THRESHOLD (spread < threshold → medium)", () => {
      // spread < SPREAD_THRESHOLD → medium; spread === SPREAD_THRESHOLD → NOT < → stays high
      const result = determineConfidence(0.9, SPREAD_THRESHOLD, 20, 30);
      expect(result).toBe("high");
    });
  });

  describe("answer rate downgrade", () => {
    it("downgrades high to medium when answerRate < 0.2", () => {
      // 1 answered out of 30 = 3.3% answer rate
      const result = determineConfidence(0.9, 0.2, 1, 30);
      expect(result).toBe("medium");
    });

    it("does NOT further downgrade low confidence when answerRate < 0.2", () => {
      const result = determineConfidence(0, 0.2, 1, 30);
      expect(result).toBe("low");
    });

    it("does NOT downgrade medium confidence when answerRate < 0.2", () => {
      // Already medium due to low topScore; answerRate clause only downgrades 'high'
      const result = determineConfidence(
        MEDIUM_CONFIDENCE_THRESHOLD - 0.01,
        0.2,
        1,
        30
      );
      expect(result).toBe("medium");
    });

    it("does not downgrade when answerRate is exactly 0.2", () => {
      // 6 / 30 = 0.2, which is NOT < 0.2
      const result = determineConfidence(0.9, 0.2, 6, 30);
      expect(result).toBe("high");
    });
  });

  describe("edge cases", () => {
    it("handles answeredCount of 0 without dividing by zero", () => {
      // 0 / 30 = 0, which is < 0.2; if initial confidence is high, it downgrades
      const result = determineConfidence(0.9, 0.2, 0, 30);
      expect(result).toBe("medium");
    });

    it("handles totalQuestions of 1 answered fully", () => {
      // 1/1 = 1.0 answerRate; no downgrade
      const result = determineConfidence(0.9, 0.2, 1, 1);
      expect(result).toBe("high");
    });

    it("handles all-or-nothing: 30 of 30 answered with high scores", () => {
      const result = determineConfidence(0.95, 0.3, 30, 30);
      expect(result).toBe("high");
    });
  });
});
