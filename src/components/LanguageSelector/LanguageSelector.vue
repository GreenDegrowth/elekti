<script setup lang="ts">
  import { ChevronDown, Globe } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useI18n } from "vue-i18n";
  import { availableLocales, loadAFTranslations } from "../../i18n/i18n";
  import { useUiStore } from "../../stores/uiStore";

  const { locale, t } = useI18n();
  const uiStore = useUiStore();
  const isOpen = ref(false);
  const dropdownId = "language-selector-options";

  const sortedLocales = computed(() => {
    return [...availableLocales].toSorted((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  const currentLocale = computed(() => locale.value);
  const currentLocaleName = computed(() => {
    return t(`languages.${currentLocale.value}`);
  });

  function toggleDropdown() {
    isOpen.value = !isOpen.value;
  }

  async function selectLanguage(code: string) {
    if (code === "af") {
      await loadAFTranslations();
    }
    uiStore.setLang(code as "en" | "af");
    isOpen.value = false;
  }

  function closeDropdown() {
    isOpen.value = false;
  }
</script>

<template>
  <div class="language-selector">
    <button
      @click="toggleDropdown"
      @keydown.escape.prevent="closeDropdown"
      class="language-selector__button"
      data-testid="language-toggle"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-controls="dropdownId"
      :aria-label="t('languages.change')"
      type="button"
    >
      <Globe :size="20" />
      <span>{{ currentLocaleName }}</span>
      <ChevronDown :size="16" />
    </button>

    <div
      v-if="isOpen"
      :id="dropdownId"
      class="language-selector__dropdown"
      data-testid="language-dropdown"
      role="listbox"
    >
      <button
        v-for="lang in sortedLocales"
        :key="lang.code"
        @click="selectLanguage(lang.code)"
        @keydown.enter.prevent="selectLanguage(lang.code)"
        @keydown.space.prevent="selectLanguage(lang.code)"
        class="language-selector__option"
        data-testid="language-option"
        :class="{
          'language-selector__option--active': lang.code === currentLocale,
        }"
        role="option"
        :aria-selected="lang.code === currentLocale"
        type="button"
      >
        {{ t(`languages.${lang.code}`) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
  .language-selector {
    position: relative;
  }

  .language-selector__button {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    background-color: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    letter-spacing: var(--letter-spacing-2xl);
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    .language-selector__button span {
      display: none;
    }
  }

  .language-selector__button:hover {
    background-color: var(--color-surface);
    border-color: var(--color-secondary);
    color: var(--color-secondary);
  }

  .language-selector__button:focus-visible,
  .language-selector__option:focus-visible {
    outline: var(--outline-width-sm) solid var(--color-secondary);
    outline-offset: 2px;
  }

  .language-selector__dropdown {
    position: absolute;
    top: calc(100% + var(--space-xs));
    right: 0;
    min-width: 180px;
    background-color: var(--color-surface-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-index-sticky);
    overflow: hidden;
  }

  @media (max-width: 640px) {
    .language-selector__dropdown {
      position: fixed;
      bottom: auto;
      top: var(--header-height);
      right: var(--space-sm);
      left: var(--space-sm);
      width: auto;
      min-width: auto;
      max-height: 50vh;
      overflow-y: auto;
    }
  }

  .language-selector__option {
    display: block;
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    text-align: left;
    background: none;
    border: none;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
    letter-spacing: var(--letter-spacing-lg);
  }

  .language-selector__option:hover {
    background-color: var(--color-surface);
    color: var(--color-secondary);
  }

  .language-selector__option--active {
    background-color: var(--color-secondary);
    color: white;
  }

  .language-selector__option--active:hover {
    background-color: var(--color-secondary-dark);
  }
</style>
