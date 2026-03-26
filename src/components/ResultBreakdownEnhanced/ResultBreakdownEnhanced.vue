<script setup lang="ts">
  import { ArrowUpDown, LayoutGrid, Table } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import type { PartyScore } from "../../types";
  import { formatPercentage } from "../../utils/colorUtils";
  import PartyCard from "../PartyCard/PartyCard.vue";

  const props = defineProps<{
    scores: PartyScore[];
  }>();

  const emit = defineEmits<{
    compare: [parties: PartyScore[]];
  }>();

  useI18n();
  const viewMode = ref<"cards" | "table">("cards");
  const sortBy = ref<"score" | "name">("score");
  const selectedForComparison = ref<Set<string>>(new Set());

  const sortedScores = computed(() => {
    const scores = [...props.scores];
    return sortBy.value === "score"
      ? scores.toSorted((a, b) => b.alignmentScore - a.alignmentScore)
      : scores.toSorted((a, b) => a.party.name.localeCompare(b.party.name));
  });

  function toggleSelect(partyId: string) {
    if (selectedForComparison.value.has(partyId)) {
      selectedForComparison.value.delete(partyId);
    } else if (selectedForComparison.value.size < 3) {
      selectedForComparison.value.add(partyId);
    }
    selectedForComparison.value = new Set(selectedForComparison.value);
  }

  function compareSelected() {
    const partiesToCompare = props.scores.filter((s) =>
      selectedForComparison.value.has(s.partyId)
    );
    emit("compare", partiesToCompare);
  }

  function clearSelection() {
    selectedForComparison.value = new Set();
  }
</script>

<template>
  <div class="result-breakdown">
    <div class="result-breakdown__header">
      <h3 class="result-breakdown__title">{{ $t("results.otherParties") }}</h3>

      <div class="result-breakdown__controls">
        <div class="result-breakdown__view-toggle">
          <button
            :class="{ active: viewMode === 'cards' }"
            @click="viewMode = 'cards'"
            :aria-label="$t('results.viewCards')"
            class="result-breakdown__toggle-btn"
          >
            <LayoutGrid :size="18" />
          </button>
          <button
            :class="{ active: viewMode === 'table' }"
            @click="viewMode = 'table'"
            :aria-label="$t('results.viewTable')"
            class="result-breakdown__toggle-btn"
          >
            <Table :size="18" />
          </button>
        </div>

        <button
          @click="sortBy = sortBy === 'score' ? 'name' : 'score'"
          class="result-breakdown__sort-btn"
          :aria-label="$t('results.sortBy')"
        >
          <ArrowUpDown :size="16" />
          {{
            sortBy === "score"
              ? $t("results.sortByScore")
              : $t("results.sortByName")
          }}
        </button>
      </div>
    </div>

    <div
      v-if="selectedForComparison.size > 0"
      class="result-breakdown__comparison-bar"
    >
      <span
        >{{ selectedForComparison.size }}
        {{ $t("results.partiesSelected") }}</span
      >
      <div class="result-breakdown__comparison-actions">
        <button
          v-if="selectedForComparison.size >= 2"
          @click="compareSelected"
          class="result-breakdown__compare-btn"
        >
          {{ $t("results.compare") }}
        </button>
        <button @click="clearSelection" class="result-breakdown__clear-btn">
          {{ $t("results.clear") }}
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'cards'" class="result-breakdown__list">
      <div
        v-for="partyScore in sortedScores"
        :key="partyScore.partyId"
        class="result-breakdown__card-wrapper"
        :class="{ selected: selectedForComparison.has(partyScore.partyId) }"
      >
        <input
          type="checkbox"
          :checked="selectedForComparison.has(partyScore.partyId)"
          @change="toggleSelect(partyScore.partyId)"
          class="result-breakdown__checkbox"
          :aria-label="`Select ${partyScore.party.name} for comparison`"
        />
        <PartyCard
          :party="partyScore.party"
          :score="partyScore.alignmentScore"
          :axis-scores="partyScore.axisScores"
        />
      </div>
    </div>

    <div v-else class="result-breakdown__table" data-testid="result-table">
      <div class="result-breakdown__table-header">
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--select"
        ></div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--party"
        >
          {{ $t("results.party") }}
        </div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--score"
        >
          {{ $t("results.match") }}
        </div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--ideology"
        >
          {{ $t("results.ideology") }}
        </div>
      </div>

      <div
        v-for="partyScore in sortedScores"
        :key="partyScore.partyId"
        class="result-breakdown__table-row"
        data-testid="result-table-row"
        :class="{ selected: selectedForComparison.has(partyScore.partyId) }"
      >
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--select"
        >
          <input
            type="checkbox"
            :checked="selectedForComparison.has(partyScore.partyId)"
            @change="toggleSelect(partyScore.partyId)"
            :aria-label="`Select ${partyScore.party.name} for comparison`"
          />
        </div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--party"
        >
          <div class="result-breakdown__party-info">
            <span class="result-breakdown__party-name">{{
              partyScore.party.name
            }}</span>
            <span
              class="result-breakdown__party-short"
              :style="{ backgroundColor: partyScore.party.colour }"
            >
              {{ partyScore.party.short }}
            </span>
          </div>
        </div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--score"
        >
          <div class="result-breakdown__score-bar-wrapper">
            <div class="result-breakdown__score-bar">
              <div
                class="result-breakdown__score-fill"
                :style="{
                  width: `${formatPercentage(partyScore.alignmentScore)}%`,
                  backgroundColor: partyScore.party.colour,
                }"
              />
            </div>
            <span class="result-breakdown__score-text">
              {{ formatPercentage(partyScore.alignmentScore) }}%
            </span>
          </div>
        </div>
        <div
          class="result-breakdown__table-cell result-breakdown__table-cell--ideology"
        >
          {{ $t(partyScore.party.ideologyKey) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .result-breakdown {
    width: 100%;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-left: 4px solid var(--color-secondary);
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .result-breakdown__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-md);
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .result-breakdown__title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    letter-spacing: var(--letter-spacing-4xl);
    margin: 0;
  }

  .result-breakdown__controls {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .result-breakdown__view-toggle {
    display: flex;
    gap: var(--space-xs);
    background: var(--color-surface-elevated);
    padding: var(--space-xs);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
  }

  .result-breakdown__toggle-btn {
    background: none;
    border: none;
    padding: var(--space-sm);
    cursor: pointer;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    transition: all var(--transition-fast);
  }

  .result-breakdown__toggle-btn.active {
    background: var(--color-primary);
    color: white;
  }

  .result-breakdown__toggle-btn:hover:not(.active) {
    background: var(--color-surface);
  }

  .result-breakdown__sort-btn {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    background: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    transition: all var(--transition-fast);
  }

  .result-breakdown__sort-btn:hover {
    background: var(--color-surface);
    border-color: var(--color-primary);
    color: var(--color-text-primary);
  }

  .result-breakdown__comparison-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-md);
    background: var(--color-accent);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-md);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  .result-breakdown__comparison-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .result-breakdown__compare-btn,
  .result-breakdown__clear-btn {
    padding: var(--space-sm) var(--space-md);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-fast);
  }

  .result-breakdown__compare-btn {
    background: var(--color-primary);
    color: white;
  }

  .result-breakdown__compare-btn:hover {
    background: var(--color-primary-dark);
  }

  .result-breakdown__clear-btn {
    background: var(--color-surface);
    color: var(--color-text-primary);
  }

  .result-breakdown__clear-btn:hover {
    background: var(--color-surface-elevated);
  }

  .result-breakdown__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-top: var(--space-md);
  }

  .result-breakdown__card-wrapper {
    position: relative;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    transition: border-color var(--transition-fast);
  }

  .result-breakdown__card-wrapper.selected {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 5%, transparent);
  }

  .result-breakdown__checkbox {
    position: absolute;
    bottom: var(--space-md);
    right: var(--space-md);
    z-index: var(--z-index-dropdown);
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .result-breakdown__table {
    margin-top: var(--space-md);
    overflow-x: auto;
  }

  .result-breakdown__table-header {
    display: grid;
    grid-template-columns: 40px minmax(200px, 3fr) 1.5fr 2fr;
    gap: var(--space-md);
    padding: var(--space-md);
    background: var(--color-surface-elevated);
    border-bottom: 2px solid var(--color-border);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-4xl);
  }

  .result-breakdown__table-row {
    display: grid;
    grid-template-columns: 40px minmax(200px, 3fr) 1.5fr 2fr;
    gap: var(--space-md);
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-border);
    transition: all var(--transition-fast);
  }

  .result-breakdown__table-row:hover {
    background: var(--color-surface-elevated);
  }

  .result-breakdown__table-row.selected {
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    border-left: 4px solid var(--color-primary);
  }

  .result-breakdown__table-cell {
    display: flex;
    align-items: center;
  }

  .result-breakdown__table-cell--select {
    justify-content: center;
    overflow: visible;
  }

  .result-breakdown__table-cell--select input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  .result-breakdown__party-info {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
  }

  .result-breakdown__party-name {
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    word-break: break-word;
    line-height: var(--line-height-tight);
  }

  .result-breakdown__party-short {
    padding: var(--space-xs) var(--space-sm);
    color: white;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-md);
    white-space: nowrap;
    position: relative;
    z-index: var(--z-index-above);
  }

  .result-breakdown__score-bar-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
  }

  .result-breakdown__score-bar {
    flex: 1;
    height: var(--bar-height-md);
    background: var(--color-surface-elevated);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .result-breakdown__score-fill {
    height: 100%;
    transition: width var(--transition-base);
  }

  .result-breakdown__score-text {
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    min-width: 50px;
    text-align: right;
  }

  @media (max-width: 768px) {
    .result-breakdown {
      padding: var(--space-lg);
    }

    .result-breakdown__header {
      flex-direction: column;
      align-items: stretch;
    }

    .result-breakdown__controls {
      flex-direction: column;
    }

    .result-breakdown__table-header,
    .result-breakdown__table-row {
      grid-template-columns: 32px 1fr 75px;
      gap: var(--space-sm);
    }

    .result-breakdown__party-info {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xs);
    }

    .result-breakdown__party-name {
      font-size: var(--font-size-sm);
    }

    .result-breakdown__party-short {
      padding: var(--space-xs) var(--space-xs);
      font-size: var(--font-size-xs);
      align-self: flex-start;
    }

    .result-breakdown__score-bar-wrapper {
      flex-direction: column;
      gap: var(--space-xs);
    }

    .result-breakdown__score-bar {
      min-height: var(--bar-height-sm);
    }

    .result-breakdown__score-text {
      font-size: var(--font-size-sm);
      min-width: auto;
      text-align: left;
    }

    .result-breakdown__table-cell--ideology {
      display: none;
    }

    .result-breakdown__comparison-bar {
      flex-direction: column;
      gap: var(--space-sm);
    }
  }
</style>
