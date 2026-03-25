import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { i18n } from "../i18n/i18n";

import { useQuestionTranslation } from "../composables/useQuestionTranslation";
import rawSurveysData from "../data/surveys.json";
import type { Question, QuizResult } from "../types";
import { getParties } from "../utils/dataLoader";
import { computeScores as computeScoresUtility } from "../utils/scoring";
import { decodeAnswersFromUrl, encodeAnswers } from "../utils/urlCodec";
import { validateSurveys } from "../validators/data";
import { useUiStore, type SurveyMode } from "./uiStore";

const surveysValidation = validateSurveys(rawSurveysData);
if (!surveysValidation.success) {
  throw new Error(
    `Invalid surveys.json: ${surveysValidation.errors?.join("; ")}`
  );
}
const surveysData = surveysValidation.data!;

export interface LoadAnswersResult {
  success: boolean;
  restoredCount?: number;
  completed?: boolean;
  error?: string;
}

export const useQuizStore = defineStore("quiz", () => {
  const answers = ref<Record<string, number>>({});
  const currentQuestionIndex = ref(0);
  const completed = ref(false);
  const ui = useUiStore();
  const mode = ref<SurveyMode>(ui.mode);
  const selectedQuestionIds = ref<string[]>([]);

  const parties = getParties();
  const translator = useQuestionTranslation();

  function loadSurvey(newMode: SurveyMode, questionIdsOverride?: string[]) {
    translator.clearCache();
    mode.value = newMode;
    ui.setMode(newMode);
    const ids =
      questionIdsOverride && questionIdsOverride.length > 0
        ? questionIdsOverride
        : (surveysData.surveys[newMode] ?? []);

    const q = translator.getTranslated(ids.length > 0 ? ids : undefined);
    selectedQuestionIds.value = q.map((qq) => qq.id);
    questions.value = q;
    reset();
  }

  const questions = ref<Question[]>([]);
  loadSurvey(mode.value);

  watch(
    () => i18n.global.locale.value,
    () => {
      translator.clearCache();
      if (selectedQuestionIds.value.length === 0) {
        return;
      }
      questions.value = translator.getTranslated(selectedQuestionIds.value);
    }
  );

  const currentQuestion = computed(
    () => questions.value[currentQuestionIndex.value]
  );
  const upcomingQuestion = computed(
    () => questions.value[currentQuestionIndex.value + 1]
  );
  const progress = computed(
    () => (currentQuestionIndex.value / questions.value.length) * 100
  );
  const answeredCount = computed(() => Object.keys(answers.value).length);
  const canProceed = computed(() => {
    const q = currentQuestion.value;
    return q ? answers.value[q.id] !== undefined : false;
  });

  function reorderRemainingQuestions() {
    const idx = currentQuestionIndex.value;
    if (idx >= questions.value.length - 1) return;

    // Use ALL answers (not just answered questions before idx) so that
    // navigating back and re-answering doesn't skew the coverage counts.
    const answeredPerAxis: Record<string, number> = {};
    for (const q of questions.value) {
      if (answers.value[q.id] !== undefined) {
        answeredPerAxis[q.axis] = (answeredPerAxis[q.axis] ?? 0) + 1;
      }
    }

    const fixed = questions.value.slice(0, idx + 1);
    const remaining = questions.value.slice(idx + 1);

    // Keep already-answered remaining questions in their relative order;
    // only sort the unanswered subset so revisited questions don't jump around.
    const answeredRemaining = remaining.filter(
      (q) => answers.value[q.id] !== undefined
    );
    const unansweredRemaining = remaining.filter(
      (q) => answers.value[q.id] === undefined
    );

    unansweredRemaining.sort(
      (a, b) => (answeredPerAxis[a.axis] ?? 0) - (answeredPerAxis[b.axis] ?? 0)
    );

    questions.value = [...fixed, ...answeredRemaining, ...unansweredRemaining];
  }

  function answerQuestion(questionId: string, optionIndex: number) {
    answers.value[questionId] = optionIndex;
    reorderRemainingQuestions();
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    } else {
      completed.value = true;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function skipQuestion() {
    nextQuestion();
  }

  function computeScores(): QuizResult {
    return computeScoresUtility(answers.value, parties);
  }

  function reset() {
    answers.value = {};
    currentQuestionIndex.value = 0;
    completed.value = false;
  }

  function encodeAnswersToUrl(): string {
    // Always encode in the original survey order, not the (potentially adaptive-reordered) display order
    const orderedQuestions = questions.value.toSorted(
      (a, b) =>
        selectedQuestionIds.value.indexOf(a.id) -
        selectedQuestionIds.value.indexOf(b.id)
    );
    return encodeAnswers(orderedQuestions, answers.value);
  }

  function loadAnswersFromUrl(
    encoded: string,
    questionIdsParam?: string[]
  ): LoadAnswersResult {
    const questionIds =
      questionIdsParam && questionIdsParam.length > 0
        ? questionIdsParam
        : questions.value.map((q) => q.id);

    const availableIds = questions.value.map((q) => q.id);
    const decoded = decodeAnswersFromUrl(encoded, questionIds, availableIds);

    if (!decoded.success || !decoded.answers) {
      return { success: false, error: decoded.error };
    }

    answers.value = decoded.answers;
    completed.value = decoded.restoredCount === questionIds.length;

    return {
      success: true,
      restoredCount: decoded.restoredCount,
      completed: completed.value,
    };
  }

  watch(
    () => currentQuestionIndex.value,
    () => {
      const upcoming = upcomingQuestion.value;
      if (upcoming?.textKey) {
        // Pre-warm the i18n translation cache for the upcoming question
        String(i18n.global.t(upcoming.textKey));
      }
    },
    { immediate: true }
  );

  return {
    answers,
    currentQuestionIndex,
    completed,
    mode,
    currentQuestion,
    progress,
    answeredCount,
    canProceed,
    questions,
    upcomingQuestion,
    selectedQuestionIds,
    parties,
    answerQuestion,
    reorderRemainingQuestions,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    computeScores,
    reset,
    encodeAnswersToUrl,
    loadAnswersFromUrl,
    loadSurvey,
    setCompleted: (value: boolean) => {
      completed.value = value;
    },
  };
});
