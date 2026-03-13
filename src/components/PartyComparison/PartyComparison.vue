<script setup lang="ts">
  import { X } from "lucide-vue-next";
  import { useI18n } from "vue-i18n";
  import type { PartyScore } from "../../types";
  import { getAxes } from "../../utils/dataLoader";

  defineProps<{
    parties: PartyScore[];
    show: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  useI18n();
  const axes = getAxes();

  const formatPercentage = (score: number): string => {
    const percentage = Math.max(0, score * 100);
    return percentage.toFixed(1);
  };
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="comparison-modal" @click="emit('close')">
      <div class="comparison-modal__content" @click.stop>
        <div class="comparison-modal__header">
          <h2 class="comparison-modal__title">
            {{ $t("results.compareParties") }}
          </h2>
          <button
            class="comparison-modal__close"
            @click="emit('close')"
            aria-label="Close comparison"
          >
            <X :size="24" />
          </button>
        </div>

        <div class="comparison-modal__body">
          <div class="comparison-table">
            <div class="comparison-table__header">
              <div class="comparison-table__cell comparison-table__cell--label">
                {{ $t("results.issue") }}
              </div>
              <div
                v-for="party in parties"
                :key="party.partyId"
                class="comparison-table__cell comparison-table__cell--party"
              >
                <div class="comparison-table__party-name">
                  {{ party.party.name }}
                </div>
                <div class="comparison-table__party-score">
                  {{ formatPercentage(party.alignmentScore) }}%
                </div>
              </div>
            </div>

            <div
              v-for="axis in axes"
              :key="axis.id"
              class="comparison-table__row"
            >
              <div class="comparison-table__cell comparison-table__cell--label">
                {{ $t(axis.shortNameKey) }}
              </div>
              <div
                v-for="party in parties"
                :key="party.partyId"
                class="comparison-table__cell comparison-table__cell--score"
              >
                <div class="comparison-table__bar-container">
                  <div
                    class="comparison-table__bar"
                    :style="{
                      width: `${Math.max(0, (party.axisScores?.[axis.id] ?? 0) * 100)}%`,
                    }"
                  />
                </div>
                <span class="comparison-table__score-text">
                  {{ formatPercentage(party.axisScores?.[axis.id] ?? 0) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
  .comparison-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-index-modal);
    padding: var(--space-lg);
    overflow-y: auto;
  }

  .comparison-modal__content {
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    max-width: 1200px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-xl);
  }

  .comparison-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    border-bottom: 2px solid var(--color-border);
    background: var(--color-surface-elevated);
  }

  .comparison-modal__title {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
  }

  .comparison-modal__close {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .comparison-modal__close:hover {
    background: var(--color-surface);
    color: var(--color-text-primary);
  }

  .comparison-modal__body {
    padding: 0;
    overflow-y: auto;
    overflow-x: auto;
  }

  .comparison-table {
    width: 100%;
    min-width: 480px;
    border-collapse: collapse;
    padding: var(--space-lg);
    padding-top: 0;
  }

  .comparison-table__header {
    display: grid;
    grid-template-columns: 200px repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    position: sticky;
    top: 0;
    background: var(--color-surface);
    z-index: var(--z-index-above);
    padding-top: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 2px solid var(--color-border);
    margin-top: 0;
  }

  .comparison-table__row {
    display: grid;
    grid-template-columns: 200px repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-sm);
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .comparison-table__row:hover {
    background: var(--color-surface-elevated);
  }

  .comparison-table__cell {
    padding: var(--space-sm);
  }

  .comparison-table__cell--label {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

  .comparison-table__cell--party {
    text-align: center;
  }

  .comparison-table__party-name {
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-xs);
  }

  .comparison-table__party-score {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .comparison-table__cell--score {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .comparison-table__bar-container {
    width: 100%;
    height: var(--bar-height-sm);
    background: var(--color-surface-elevated);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .comparison-table__bar {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--color-primary),
      var(--color-secondary)
    );
    transition: width var(--transition-base);
  }

  .comparison-table__score-text {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    text-align: center;
  }

  @media (max-width: 768px) {
    .comparison-table__header,
    .comparison-table__row {
      grid-template-columns: 120px repeat(auto-fit, minmax(100px, 1fr));
    }

    .comparison-modal__title {
      font-size: var(--font-size-lg);
    }
  }

  @media (max-width: 640px) {
    .comparison-modal {
      padding: var(--space-sm);
      align-items: flex-end;
    }

    .comparison-modal__content {
      max-height: 85vh;
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    }

    .comparison-modal__header {
      padding: var(--space-md);
    }
  }
</style>
