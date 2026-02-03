import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import {
  AnswerIndexSchema,
  AnswersRecordSchema,
  type AnswerIndex,
  type AnswersRecord,
} from "../schemas/answers";
import { AxisSchema, type Axis } from "../schemas/axis";
import { PartySchema, type Party } from "../schemas/party";
import {
  PartyPositionValueSchema,
  type PartyPositionValue,
} from "../schemas/party-positions";
import {
  QuestionMetadataSchema,
  type QuestionMetadata,
} from "../schemas/question";

export interface SchemaValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): SchemaValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    let errorMessage = "Validation failed";

    if (error instanceof ZodError && error.issues.length > 0) {
      const issue = error.issues[0];
      if (issue) {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        errorMessage = `${path}${issue.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}

export function validateParty(data: unknown): SchemaValidationResult<Party> {
  return validateSchema(PartySchema, data);
}

export function validateAxis(data: unknown): SchemaValidationResult<Axis> {
  return validateSchema(AxisSchema, data);
}

export function validateQuestion(
  data: unknown
): SchemaValidationResult<QuestionMetadata> {
  return validateSchema(QuestionMetadataSchema, data);
}

export function validateAnswerIndex(
  data: unknown
): SchemaValidationResult<AnswerIndex> {
  return validateSchema(AnswerIndexSchema, data);
}

export function validateAnswersRecord(
  data: unknown
): SchemaValidationResult<AnswersRecord> {
  return validateSchema(AnswersRecordSchema, data);
}

export function validatePartyPositionValue(
  data: unknown
): SchemaValidationResult<PartyPositionValue> {
  return validateSchema(PartyPositionValueSchema, data);
}
