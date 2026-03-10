<script setup lang="ts">
  import { HelpCircle, TrendingDown, TrendingUp } from "lucide-vue-next";
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";

  defineProps<{
    confidence: "high" | "medium" | "low";
    primaryScore: number;
    alternativeScores: number[];
  }>();

  useI18n();
  const showTooltip = ref(false);
</script>

<template>
  <div
    class="confidence-indicator"
    :class="`confidence-indicator--${confidence}`"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div class="confidence-indicator__content">
      <component
        :is="
          confidence === 'high'
            ? TrendingUp
            : confidence === 'low'
              ? TrendingDown
              : HelpCircle
        "
        :size="20"
      />
      <span class="confidence-indicator__label">
        {{ $t(`results.confidence.${confidence}`) }}
      </span>
    </div>

    <div v-if="showTooltip" class="confidence-indicator__tooltip">
      <p class="confidence-indicator__tooltip-title">
        {{ $t(`results.confidenceExplainer.${confidence}.title`) }}
      </p>
      <p class="confidence-indicator__tooltip-text">
        {{ $t(`results.confidenceExplainer.${confidence}.description`) }}
      </p>
      <div class="confidence-indicator__tooltip-scores">
        <div class="confidence-indicator__tooltip-score">
          <span class="confidence-indicator__tooltip-score-label">{{
            $t("results.topMatch")
          }}</span>
          <span class="confidence-indicator__tooltip-score-value"
            >{{ (primaryScore * 100).toFixed(1) }}%</span
          >
        </div>
        <div
          v-if="alternativeScores.length > 0"
          class="confidence-indicator__tooltip-score"
        >
          <span class="confidence-indicator__tooltip-score-label">{{
            $t("results.secondMatch")
          }}</span>
          <span class="confidence-indicator__tooltip-score-value"
            >{{ ((alternativeScores[0] ?? 0) * 100).toFixed(1) }}%</span
          >
        </div>
        <div
          v-if="alternativeScores.length > 0"
          class="confidence-indicator__tooltip-gap"
        >
          {{ $t("results.gap") }}:
          {{ ((primaryScore - (alternativeScores[0] ?? 0)) * 100).toFixed(1) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .confidence-indicator {
    position: relative;
    display: inline-flex;
    padding: var(--space-sm) var(--space-lg);
    border-radius: 0;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-3xl);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-fast);
    height: 40px;
    text-transform: uppercase;
    cursor: help;
    z-index: var(--z-index-dropdown);
  }

  .confidence-indicator:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .confidence-indicator__content {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .confidence-indicator--high {
    background: linear-gradient(
      135deg,
      var(--color-primary),
      color-mix(in srgb, var(--color-secondary) 25%, var(--color-primary))
    );
    color: white;
  }

  .confidence-indicator--medium {
    background: linear-gradient(
      135deg,
      var(--color-accent),
      color-mix(in srgb, var(--color-secondary) 20%, var(--color-accent))
    );
    color: var(--color-text-primary);
  }

  .confidence-indicator--low {
    background: linear-gradient(
      135deg,
      var(--color-signal-brick),
      color-mix(
        in srgb,
        var(--color-secondary-dark) 35%,
        var(--color-signal-brick)
      )
    );
    color: white;
  }

  .confidence-indicator__tooltip {
    position: absolute;
    top: calc(100% + var(--space-sm));
    right: 0;
    background: var(--color-surface-elevated);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--space-md);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-index-modal);
    min-width: 300px;
    max-width: 400px;
  }

  .confidence-indicator__tooltip-title {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin: 0 0 var(--space-xs) 0;
    text-transform: none;
  }

  .confidence-indicator__tooltip-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    margin: 0 0 var(--space-md) 0;
    text-transform: none;
    font-weight: var(--font-weight-normal);
    letter-spacing: normal;
  }

  .confidence-indicator__tooltip-scores {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--color-border);
  }

  .confidence-indicator__tooltip-score {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .confidence-indicator__tooltip-score-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    text-transform: none;
    font-weight: var(--font-weight-normal);
    letter-spacing: normal;
  }

  .confidence-indicator__tooltip-score-value {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    text-transform: none;
    letter-spacing: normal;
  }

  .confidence-indicator__tooltip-gap {
    font-size: var(--font-size-xs);
    color: var(--color-text-primary);
    font-weight: var(--font-weight-semibold);
    padding: var(--space-xs);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    text-align: center;
    margin-top: var(--space-xs);
    text-transform: none;
    letter-spacing: normal;
  }

  @media (max-width: 640px) {
    .confidence-indicator__tooltip {
      right: auto;
      left: 0;
      max-width: 90vw;
    }
  }
</style>
