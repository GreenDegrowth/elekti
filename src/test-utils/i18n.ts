import { createI18n } from "vue-i18n";

/**
 * Creates a minimal i18n plugin for component unit tests.
 * Returns the key as the translated string (no actual message lookup).
 */
export function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: "en",
    messages: { en: {} },
    missing: (_locale: string, key: string) => key,
  });
}
