<script setup lang="ts">
  import { AlertCircle, Copy, RotateCcw, Trophy } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRouter } from "vue-router";
  import ConfidenceIndicator from "../components/ConfidenceIndicator/ConfidenceIndicator.vue";
  import PartyCard from "../components/PartyCard/PartyCard.vue";
  import PartyComparison from "../components/PartyComparison/PartyComparison.vue";
  import ResultBreakdownEnhanced from "../components/ResultBreakdownEnhanced/ResultBreakdownEnhanced.vue";
  import { useResultsLoader } from "../composables/useResultsLoader";
  import { useQuizStore } from "../stores/quizStore";
  import type { Axis, PartyScore } from "../types";
  import { URL_PARAMS } from "../utils/constants";
  import { getAxes } from "../utils/dataLoader";

  const router = useRouter();
  const quizStore = useQuizStore();
  const { t } = useI18n();
  const { result, error, loading } = useResultsLoader();
  const copyState = ref<"idle" | "success" | "failed">("idle");
  const showComparison = ref(false);
  const comparisonParties = ref<PartyScore[]>([]);

  const modeLabel = computed(() => t(`landing.modes.${quizStore.mode}.title`));

  const topMatchAxes = computed(() => {
    if (!result.value?.primary.axisScores) return [];
    const axes = getAxes();
    return Object.entries(result.value.primary.axisScores)
      .filter(([, score]) => score >= 0.5)
      .toSorted(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([axisId]) => axes.find((a) => a.id === axisId))
      .filter((a): a is Axis => a !== undefined);
  });

  const otherScores = computed<PartyScore[]>(() => {
    const currentResult = result.value;
    if (!currentResult) {
      return [];
    }
    const excludeIds = new Set<string>([
      currentResult.primary.partyId,
      ...currentResult.alternatives.map((a) => a.partyId),
    ]);
    return currentResult.allScores.filter((s) => !excludeIds.has(s.partyId));
  });

  const alternativeScores = computed<number[]>(() => {
    return result.value?.alternatives.map((a) => a.alignmentScore) ?? [];
  });

  function copyResults() {
    if (!result.value) {
      return;
    }

    try {
      const currentParams = new URLSearchParams(globalThis.location.search);
      let shareUrl: string;
      if (currentParams.has(URL_PARAMS.RESULTS)) {
        shareUrl = globalThis.location.href;
      } else {
        const encoded = quizStore.encodeAnswersToUrl();
        const queryParams = new URLSearchParams({
          [URL_PARAMS.RESULTS]: encoded,
          [URL_PARAMS.MODE]: quizStore.mode,
          [URL_PARAMS.QUESTIONS]: quizStore.selectedQuestionIds.join(","),
        });
        shareUrl = `${globalThis.location.origin}/results?${queryParams.toString()}`;
      }

      const confidenceLabel = t(
        `results.confidence.${result.value.confidence}`
      );

      const text = `My Elekti Results:
  Primary Match: ${result.value.primary.party.name} (${(result.value.primary.alignmentScore * 100).toFixed(1)}%) — ${confidenceLabel}
  Alternatives: ${result.value.alternatives
    .map(
      (a: PartyScore) =>
        `${a.party.name} (${(a.alignmentScore * 100).toFixed(1)}%) — ${confidenceLabel}`
    )
    .join(", ")}

  View my results: ${shareUrl}`;

      navigator.clipboard.writeText(text).then(
        () => {
          copyState.value = "success";
          setTimeout(() => {
            copyState.value = "idle";
          }, 2000);
        },
        () => {
          copyState.value = "failed";
          setTimeout(() => {
            copyState.value = "idle";
          }, 2000);
        }
      );
    } catch {}
  }

  function retakeQuiz() {
    quizStore.reset();
    router.push("/quiz");
  }

  function goToQuiz() {
    router.push("/quiz");
  }

  function goHome() {
    router.push("/");
  }

  function handleCompare(parties: PartyScore[]) {
    comparisonParties.value = parties;
    showComparison.value = true;
  }

  function closeComparison() {
    showComparison.value = false;
  }
</script>

<template>
  <div class="results">
    <div class="results__container">
      <h1 class="results__title">{{ $t("results.title") }}</h1>

      <div
        v-if="loading"
        class="results__loading"
        data-testid="results-loading"
        role="status"
        aria-live="polite"
      >
        <span class="sr-only">{{ $t("results.loading") }}</span>
      </div>

      <div
        v-else-if="result"
        class="results__container"
        role="main"
        aria-label="Quiz results"
      >
        <section
          class="results__section"
          aria-labelledby="primary-match-heading"
        >
          <div class="results__header">
            <div class="results__badge">
              <Trophy :size="20" />
              <span>{{ $t("results.primaryMatch") }}</span>
            </div>

            <div class="results__mode" aria-label="Quiz mode">
              {{ modeLabel }}
            </div>

            <ConfidenceIndicator
              :confidence="result.confidence"
              :primary-score="result.primary.alignmentScore"
              :alternative-scores="alternativeScores"
            />
          </div>
          <h2 id="primary-match-heading" class="sr-only">
            {{ $t("results.primaryMatch") }}
          </h2>

          <div
            v-if="topMatchAxes.length > 0"
            class="results__why"
            aria-labelledby="why-match-label"
          >
            <span id="why-match-label" class="results__why-label">{{
              $t("results.whyThisMatch")
            }}</span>
            <span
              v-for="axis in topMatchAxes"
              :key="axis.id"
              class="results__why-badge"
              >{{ $t(axis.shortNameKey) }}</span
            >
          </div>

          <PartyCard
            :party="result.primary.party"
            :score="result.primary.alignmentScore"
            :axis-scores="result.primary.axisScores"
          />

          <button
            @click="copyResults"
            class="results__button results__button--secondary results__button--share-card"
            data-testid="results-share"
            :aria-label="
              copyState === 'success'
                ? $t('results.resultsCopied')
                : copyState === 'failed'
                  ? $t('results.copyFailed')
                  : $t('results.copyResults')
            "
          >
            <Copy :size="20" />
            {{
              copyState === "success"
                ? $t("results.resultsCopied")
                : copyState === "failed"
                  ? $t("results.copyFailed")
                  : $t("results.copyResults")
            }}
          </button>
        </section>

        <section
          v-if="result.alternatives.length > 0"
          class="results__section"
          aria-labelledby="alternatives-heading"
        >
          <h2 id="alternatives-heading" class="results__section-title">
            {{ $t("results.alternativeMatch") }}
          </h2>

          <div class="results__alternatives">
            <PartyCard
              v-for="alt in result.alternatives.slice(0, 2)"
              :key="alt.partyId"
              :party="alt.party"
              :score="alt.alignmentScore"
              :axis-scores="alt.axisScores"
            />
          </div>
        </section>

        <section class="results__section">
          <ResultBreakdownEnhanced
            :scores="otherScores"
            @compare="handleCompare"
          />
        </section>

        <div class="results__actions">
          <button
            @click="retakeQuiz"
            class="results__button results__button--primary"
            data-testid="results-retake"
          >
            <RotateCcw :size="20" />
            {{ $t("results.retakeQuiz") }}
          </button>
          <button
            @click="goHome"
            class="results__button results__button--secondary"
          >
            {{ $t("results.backToHome") }}
          </button>
        </div>
      </div>

      <div
        v-else-if="error"
        class="results__error"
        data-testid="results-error"
        role="alert"
        aria-live="polite"
      >
        <AlertCircle :size="48" />
        <p>{{ error }}</p>
        <div class="results__actions">
          <button
            @click="goToQuiz"
            class="results__button results__button--primary"
            data-testid="results-go-to-quiz"
            :aria-label="$t('landing.startButton')"
          >
            {{ $t("landing.startButton") }}
          </button>
          <button
            @click="goHome"
            class="results__button results__button--secondary"
            data-testid="results-go-home"
          >
            {{ $t("results.backToHome") }}
          </button>
        </div>
      </div>

      <div v-else class="results__empty" role="status" aria-live="polite">
        <AlertCircle :size="48" />
        <p>{{ $t("errors.noData") }}</p>
        <div class="results__actions">
          <button
            @click="goToQuiz"
            class="results__button results__button--primary"
            data-testid="results-go-to-quiz"
            :aria-label="$t('landing.startButton')"
          >
            {{ $t("landing.startButton") }}
          </button>
          <button
            @click="goHome"
            class="results__button results__button--secondary"
            data-testid="results-go-home"
          >
            {{ $t("results.backToHome") }}
          </button>
        </div>
      </div>

      <PartyComparison
        :parties="comparisonParties"
        :show="showComparison"
        @close="closeComparison"
      />
    </div>
  </div>
</template>

<style scoped>
  .results {
    min-height: calc(100vh - var(--header-height) - var(--footer-height));
    padding: var(--space-xl);
  }

  .results__container {
    max-width: var(--max-width-md);
    margin: 0 auto;
  }

  .results__title {
    text-align: center;
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-2xl);
    letter-spacing: var(--letter-spacing-tight);
  }

  .results__section {
    margin-bottom: var(--space-3xl);
  }

  .results__section:first-of-type :deep(.party-card) {
    margin-top: var(--space-md);
  }

  .results__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .results__badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    background: linear-gradient(
      135deg,
      var(--color-primary),
      color-mix(in srgb, var(--color-secondary) 25%, var(--color-primary))
    );
    color: white;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    letter-spacing: var(--letter-spacing-xl);
    text-transform: uppercase;
    height: 40px;
    border: 2px solid var(--color-primary-dark);
  }

  .results__button--share-card {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: var(--space-lg);
  }

  .results__mode {
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    display: inline-flex;
    align-items: center;
    letter-spacing: var(--letter-spacing-lg);
    box-shadow: var(--shadow-sm);
    height: 40px;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    color: var(--color-text-secondary);
  }

  .results__section-title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-xl);
    letter-spacing: var(--letter-spacing-md);
  }

  .results__alternatives {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .results__actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
    margin-top: var(--space-2xl);
  }

  .results__button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-xl);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: none;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-2xl);
  }

  .results__button--primary {
    background: linear-gradient(
      120deg,
      var(--color-primary),
      color-mix(in srgb, var(--color-secondary) 25%, var(--color-primary))
    );
    color: white;
    border: 2px solid var(--color-primary-dark);
  }

  .results__button--primary:hover {
    background: linear-gradient(
      120deg,
      var(--color-primary-dark),
      color-mix(
        in srgb,
        var(--color-secondary-dark) 35%,
        var(--color-primary-dark)
      )
    );
    box-shadow: var(--shadow-lg);
  }

  .results__button--secondary {
    background-color: var(--color-surface);
    color: var(--color-text-primary);
    border: 2px solid var(--color-border);
  }

  .results__button--secondary:hover {
    background-color: var(--color-surface-elevated);
    border-color: var(--color-secondary);
  }

  .results__loading {
    min-height: 200px;
  }

  .results__empty {
    text-align: center;
    padding: var(--space-3xl);
  }

  .results__empty p {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin: var(--space-xl) 0;
  }

  .results__error {
    text-align: center;
    padding: var(--space-3xl);
    background-color: var(--color-surface);
    border: 2px solid var(--color-error, #ef4444);
    border-radius: var(--radius-lg);
  }

  .results__error p {
    font-size: var(--font-size-lg);
    color: var(--color-error, #ef4444);
    margin: var(--space-xl) 0;
    font-weight: var(--font-weight-medium);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (max-width: 640px) {
    .results {
      padding: var(--space-lg);
    }

    .results__title {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--space-xl);
    }

    .results__header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-sm);
    }

    .results__badge,
    .results__mode,
    .results__confidence {
      width: 100%;
      justify-content: center;
      height: auto;
      padding: var(--space-sm) var(--space-md);
      text-align: center;
    }

    .results__actions {
      flex-direction: column;
    }

    .results__button {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 400px) {
    .results {
      padding: var(--space-md);
    }

    .results__title {
      font-size: var(--font-size-2xl);
    }

    .results__section {
      margin-bottom: var(--space-2xl);
    }
  }

  .results__why {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .results__why-label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-md);
  }

  .results__why-badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-xs, 2px) var(--space-sm);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }
</style>
