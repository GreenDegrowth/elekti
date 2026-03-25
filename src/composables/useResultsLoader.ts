import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useQuizStore } from "../stores/quizStore";
import { isSurveyMode, type SurveyMode } from "../stores/uiStore";
import type { QuizResult } from "../types";
import { URL_PARAMS } from "../utils/constants";

export function useResultsLoader() {
  const quizStore = useQuizStore();
  const router = useRouter();
  const { t } = useI18n();

  const result = ref<QuizResult | undefined>(undefined);
  const error = ref<string | undefined>(undefined);
  const loading = ref(true);

  onMounted(() => {
    try {
      const urlParameters = new URLSearchParams(globalThis.location.search);
      const encodedAnswers = urlParameters.get(URL_PARAMS.RESULTS);
      const modeParam = urlParameters.get(URL_PARAMS.MODE);
      const qParam = urlParameters.get(URL_PARAMS.QUESTIONS);

      if (encodedAnswers) {
        const parsedIds = qParam
          ? qParam.split(",").filter(Boolean)
          : undefined;
        if (modeParam) {
          const m: SurveyMode = isSurveyMode(modeParam)
            ? (modeParam as SurveyMode)
            : "metro";
          quizStore.loadSurvey(m, parsedIds);
        }
        const idsForDecode = parsedIds;
        const loaded = quizStore.loadAnswersFromUrl(
          encodedAnswers,
          idsForDecode
        );
        if (loaded.success) {
          result.value = quizStore.computeScores();
        } else {
          error.value = loaded.error || t("errors.invalidUrl");
        }
        loading.value = false;
        return;
      }

      if (quizStore.completed && Object.keys(quizStore.answers).length > 0) {
        result.value = quizStore.computeScores();
        const encoded = quizStore.encodeAnswersToUrl();
        const ids = quizStore.selectedQuestionIds.join(",");
        const m = quizStore.mode;
        const queryParams = {
          [URL_PARAMS.RESULTS]: encoded,
          [URL_PARAMS.MODE]: m,
          [URL_PARAMS.QUESTIONS]: ids,
        };

        const testUrl = new URLSearchParams(queryParams).toString();
        const fullUrl = `${globalThis.location.origin}/results?${testUrl}`;

        if (fullUrl.length <= URL_PARAMS.MAX_URL_LENGTH) {
          router.replace({ query: queryParams });
        }
      } else {
        error.value = t("errors.noData");
      }
    } catch {
      error.value = t("errors.loadFailed");
    }
    loading.value = false;
  });

  return { result, error, loading };
}
