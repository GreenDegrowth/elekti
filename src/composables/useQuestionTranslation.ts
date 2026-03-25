import { i18n } from "../i18n/i18n";
import type { Question, QuestionMetadata } from "../types";
import { STANDARD_OPTIONS } from "../utils/constants";
import { getQuestions } from "../utils/dataLoader";

function t(key: string): string {
  return String(i18n.global.t(key));
}

export function useQuestionTranslation() {
  const cache = new Map<string, Question[]>();

  function clearCache(): void {
    cache.clear();
  }

  function getTranslated(ids?: string[]): Question[] {
    const locale = i18n.global.locale.value;
    const idKey = ids && ids.length > 0 ? ids.join("|") : "all";
    const cacheKey = `${locale}|${idKey}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const base = getQuestions();
    const filtered =
      ids && ids.length > 0
        ? (() => {
            const byId = new Map(base.map((q) => [q.id, q]));
            return ids
              .map((id) => byId.get(id))
              .filter((q): q is QuestionMetadata => q !== undefined);
          })()
        : base;

    const translated = filtered.map((q: QuestionMetadata) => ({
      ...q,
      text: t(q.textKey),
      textKey: q.textKey,
      options: STANDARD_OPTIONS,
    }));

    cache.set(cacheKey, translated);
    return translated;
  }

  return { getTranslated, clearCache };
}
