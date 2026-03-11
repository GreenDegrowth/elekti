import type { Axis, QuestionMetadata } from "../types";
import { getAxes, getPartyPositions, getQuestions } from "./dataLoader";

export type ScoringData = {
  axes: Axis[];
  partyPositions: Record<string, Record<string, number>>;
  questionsMetadata: QuestionMetadata[];
  questionById: Map<string, QuestionMetadata>;
};

let cachedScoringData: ScoringData | undefined;

export function clearScoringCache(): void {
  cachedScoringData = undefined;
}

export function getScoringData(): ScoringData {
  if (cachedScoringData) {
    return cachedScoringData;
  }

  const axes = getAxes();
  const partyPositions = getPartyPositions();
  const questionsMetadata = getQuestions();
  const questionById = new Map(
    questionsMetadata.map((question) => [question.id, question])
  );

  cachedScoringData = { axes, partyPositions, questionsMetadata, questionById };
  return cachedScoringData;
}
