import { describe, expect, it } from "vitest";
import {
  validateAnswerIndex,
  validateAnswersRecord,
  validateAxis,
  validateParty,
  validatePartyPositionValue,
  validateQuestion,
} from "./schema";

describe("Individual Schema Validators", () => {
  describe("validateParty", () => {
    it("should validate a valid party object", () => {
      const validParty = {
        id: "party1",
        name: "Test Party",
        short: "TP",
        descriptionKey: "parties.party1.description",
        ideologyKey: "parties.party1.ideology",
        colour: "#FF0000",
        website: "https://example.com",
      };

      const result = validateParty(validParty);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validParty);
      expect(result.error).toBeUndefined();
    });

    it("should reject party with invalid hex colour", () => {
      const invalidParty = {
        id: "party1",
        name: "Test Party",
        short: "TP",
        descriptionKey: "parties.party1.description",
        ideologyKey: "parties.party1.ideology",
        colour: "invalid",
        website: "https://example.com",
      };

      const result = validateParty(invalidParty);
      expect(result.success).toBe(false);
      expect(result.error).toContain("valid hex");
    });

    it("should reject party with invalid URL", () => {
      const invalidParty = {
        id: "party1",
        name: "Test Party",
        short: "TP",
        descriptionKey: "parties.party1.description",
        ideologyKey: "parties.party1.ideology",
        colour: "#FF0000",
        website: "not-a-url",
      };

      const result = validateParty(invalidParty);
      expect(result.success).toBe(false);
      expect(result.error).toContain("valid URL");
    });
  });

  describe("validateAxis", () => {
    it("should validate a valid axis object", () => {
      const validAxis = {
        id: "test_axis",
        name: "Test Axis",
        shortNameKey: "axes.test_axis.short",
        description: "A test axis for validation",
      };

      const result = validateAxis(validAxis);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validAxis);
    });

    it("should reject axis with missing required fields", () => {
      const invalidAxis = {
        id: "test_axis",
        // missing name, shortNameKey, description
      };

      const result = validateAxis(invalidAxis);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("validateQuestion", () => {
    it("should validate a valid question with positive direction", () => {
      const validQuestion = {
        id: "q1",
        textKey: "questions.q1.text",
        axis: "test_axis",
        weight: 1,
        direction: "positive" as const,
      };

      const result = validateQuestion(validQuestion);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validQuestion);
    });

    it("should validate a valid question with negative direction", () => {
      const validQuestion = {
        id: "q2",
        textKey: "questions.q2.text",
        axis: "test_axis",
        weight: 1.5,
        direction: "negative" as const,
      };

      const result = validateQuestion(validQuestion);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validQuestion);
    });

    it("should validate a question without direction (defaults to positive)", () => {
      const validQuestion = {
        id: "q3",
        textKey: "questions.q3.text",
        axis: "test_axis",
        weight: 0.5,
      };

      const result = validateQuestion(validQuestion);
      expect(result.success).toBe(true);
      expect(result.data?.direction).toBeUndefined();
    });

    it("should reject question with invalid ID format", () => {
      const invalidQuestion = {
        id: "invalid",
        textKey: "questions.q1.text",
        axis: "test_axis",
        weight: 1,
      };

      const result = validateQuestion(invalidQuestion);
      expect(result.success).toBe(false);
      expect(result.error).toContain("format q1, q2");
    });

    it("should reject question with invalid textKey format", () => {
      const invalidQuestion = {
        id: "q1",
        textKey: "invalid",
        axis: "test_axis",
        weight: 1,
      };

      const result = validateQuestion(invalidQuestion);
      expect(result.success).toBe(false);
      expect(result.error).toContain("format questions.qN.text");
    });

    it("should reject question with non-positive weight", () => {
      const invalidQuestion = {
        id: "q1",
        textKey: "questions.q1.text",
        axis: "test_axis",
        weight: 0,
      };

      const result = validateQuestion(invalidQuestion);
      expect(result.success).toBe(false);
      expect(result.error).toContain("positive");
    });
  });

  describe("validateAnswerIndex", () => {
    it("should validate answer indices 0-4", () => {
      for (let i = 0; i <= 4; i++) {
        const result = validateAnswerIndex(i);
        expect(result.success).toBe(true);
        expect(result.data).toBe(i);
      }
    });

    it("should reject answer index less than 0", () => {
      const result = validateAnswerIndex(-1);
      expect(result.success).toBe(false);
      expect(result.error).toContain(">= 0");
    });

    it("should reject answer index greater than 4", () => {
      const result = validateAnswerIndex(5);
      expect(result.success).toBe(false);
      expect(result.error).toContain("<= 4");
    });

    it("should reject non-integer answer index", () => {
      const result = validateAnswerIndex(2.5);
      expect(result.success).toBe(false);
      expect(result.error).toContain("integer");
    });
  });

  describe("validateAnswersRecord", () => {
    it("should validate a valid answers record", () => {
      const validAnswers = {
        q1: 0,
        q2: 2,
        q3: 4,
      };

      const result = validateAnswersRecord(validAnswers);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validAnswers);
    });

    it("should reject answers with invalid indices", () => {
      const invalidAnswers = {
        q1: 0,
        q2: 5,
      };

      const result = validateAnswersRecord(invalidAnswers);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should accept empty answers record", () => {
      const result = validateAnswersRecord({});
      expect(result.success).toBe(true);
    });
  });

  describe("validatePartyPositionValue", () => {
    it("should validate values between -1 and 1", () => {
      const testValues = [-1, -0.5, 0, 0.5, 1];

      for (const value of testValues) {
        const result = validatePartyPositionValue(value);
        expect(result.success).toBe(true);
        expect(result.data).toBe(value);
      }
    });

    it("should reject values less than -1", () => {
      const result = validatePartyPositionValue(-1.1);
      expect(result.success).toBe(false);
      expect(result.error).toContain(">= -1");
    });

    it("should reject values greater than 1", () => {
      const result = validatePartyPositionValue(1.1);
      expect(result.success).toBe(false);
      expect(result.error).toContain("<= 1");
    });
  });
});
