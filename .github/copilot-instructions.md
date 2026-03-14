# Project Guidelines — Elekti

Political alignment quiz: Vue 3 + TypeScript, Pinia, vue-i18n, vue-router, Zod, Vite (rolldown-vite).

## Build and Test

```sh
npm run dev          # dev server at http://localhost:5173
npm run build        # type-check + bundle (fails on TS errors)
npm run test         # Vitest (happy-dom)
npm run lint         # oxlint + ESLint with autofix
npm run format       # Prettier + organize-imports
npm run type-check   # vue-tsc only
npx vitest run <file>  # single test file
```

## Architecture

Static JSON data (`src/data/`) imported at build time → cached by `src/utils/dataLoader.ts` → consumed by Pinia stores → rendered by Vue components.

| Layer       | Location           | Role                                                                  |
| ----------- | ------------------ | --------------------------------------------------------------------- |
| Data        | `src/data/*.json`  | Questions, axes, parties, positions, surveys, translations            |
| Schemas     | `src/schemas/`     | Zod schemas + inferred TS types                                       |
| Validators  | `src/validators/`  | Return `{ success, data, errors }` — never throw                      |
| Stores      | `src/stores/`      | `quizStore` (quiz state + URL codec), `uiStore` (locale + mode)       |
| Composables | `src/composables/` | Side effects + caching (`useResultsLoader`, `useQuestionTranslation`) |
| Components  | `src/components/`  | Stateless SFCs — props in, computed out, state lives in stores        |
| Views       | `src/views/`       | Route-level pages                                                     |

See [docs/scoring-algorithm.md](../docs/scoring-algorithm.md) for the alignment calculation details.

## Code Style

- **SFC structure**: `<script setup lang="ts">` → `<template>` → `<style scoped>` with BEM naming
- **Props**: `defineProps<T>()` with TypeScript generics — no runtime prop validation
- **State**: `ref()` for local, `computed()` for derived, Pinia stores for shared
- **Icons**: `lucide-vue-next` — always mock in tests
- **Path alias**: `@/*` → `./src/*`

## Testing Conventions

- Mount wrapper factories: `mountCard(overrides?)` pattern
- **Always** `setActivePinia(createPinia())` per test for store isolation
- Call `clearDataCaches()` and/or `clearScoringCache()` when tests modify data
- Use `data-testid` attributes for element queries — never class selectors
- Mock `lucide-vue-next` and data loaders at module level with `vi.mock()`
- Shared helpers in `src/test-utils/` (`createTestI18n()`, `makeEncodedAnswers()`, factories)
- E2E tests live in `e2e/` and use Playwright

## i18n Rules

- English loaded eagerly; Afrikaans lazy-loaded on first switch
- `en.json` is the canonical type source — add keys there first, then mirror in `af.json`
- In stores, use `i18n.global.t()` (not `useI18n()` — stores run outside component context)
- Translation cache is keyed by `locale|questionIds`; invalidated automatically on locale change

## Adding Content

| Content      | Files to update                                                                      |
| ------------ | ------------------------------------------------------------------------------------ |
| New question | `questions.json`, `surveys.json`, `party_positions.json`, both `translations/*.json` |
| New party    | `parties.json`, `party_positions.json` (all 10 axes), both `translations/*.json`     |
| New i18n key | `en.json` first (type source), then `af.json`                                        |

See [docs/content-workflow.md](../docs/content-workflow.md) and [docs/party-guide.md](../docs/party-guide.md) for detailed steps.

## Key Constraints

- Party colours: 6-digit hex (`#RRGGBB`) — used by contrast utility in `PartyCard.vue`
- Party positions: `[-1, 1]` range — enforced by `PartyPositionValueSchema`
- `surveys.json` validated at startup — app throws on invalid data
- URL answers: 3-bit-per-answer base64url encoding; URLs capped at 2000 chars
- Negative-direction questions (`direction: "negative"`) negate user value before scoring
- localStorage keys: `"lang"` for locale, `"mode"` for survey mode
