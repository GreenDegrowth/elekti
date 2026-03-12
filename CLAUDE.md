# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev          # dev server at http://localhost:5173
npm run build        # type-check + bundle (fails on type errors)
npm run test         # run all Vitest tests
npm run test:ui      # Vitest with browser UI
npm run lint         # oxlint + ESLint with autofix
npm run format       # Prettier + organize-imports
npm run type-check   # vue-tsc only, no bundle
```

To run a single test file:
```sh
npx vitest run src/utils/scoring.test.ts
```

## Architecture

**Stack:** Vue 3 + TypeScript, Pinia, vue-i18n, vue-router, Zod, Vite (rolldown-vite). Tests run in happy-dom via Vitest.

### Data flow

All static data lives in `src/data/` as JSON and is imported at build time:

- `questions.json` — 30 questions with `id`, `textKey`, `axis`, `weight`, optional `direction: "negative"`
- `axes.json` — 10 political axes
- `parties.json` — 16 parties with colour, website, i18n key references
- `party_positions.json` — per-party scores per axis (0–1 scale, normalised)
- `surveys.json` — question ID lists per survey mode. Currently only one mode exists: `metro` (30 questions). The `surveys` key is a `Record<string, string[]>`, validated by `SurveysFileSchema`.
- `translations/{en,af}.json` — all UI text; question text is keyed via `textKey` (e.g. `questions.q1.text`)

`src/utils/dataLoader.ts` wraps JSON imports with module-level caches. Call `clearDataCaches()` in tests that need fresh state. Similarly, `src/utils/scoring.ts` exports `clearScoringCache()`.

### Scoring

`computeScores(answers, parties)` in `src/utils/scoring.ts`:
1. For each answered question, looks up the party's position on that axis
2. Computes `similarity = 1 - |userValue - partyPosition|`, weighted by `question.weight`
3. Normalises per-axis, then averages across axes → `alignmentScore` (0–1)
4. Determines `confidence` (`high`/`medium`/`low`) from score spread and answer coverage
5. Returns `QuizResult` with `primary`, `alternatives` (next 2), `allScores` (all parties sorted), `topAxes`, `answeredAxes`

Questions with `direction: "negative"` have their user value negated before comparison, so agreement with a negative-framed question maps to the opposite pole.

### Stores

**`quizStore`** (`src/stores/quizStore.ts`) — owns quiz state:
- `loadSurvey(mode, ids?)` — sets `questions`, resets answers; called on landing page and when restoring from URL
- `encodeAnswersToUrl()` / `loadAnswersFromUrl()` — 3-bit-per-answer base64url packing via `src/validators/answers.ts`; `UNANSWERED_VALUE = 7` marks skipped questions
- Translation cache (`translatedQuestionsCache`) is keyed by `locale|questionIds`; invalidated on locale change

**`uiStore`** (`src/stores/uiStore.ts`) — locale (`en`/`af`) and survey mode, both persisted to `localStorage`.

### i18n

`src/i18n/i18n.ts` loads English eagerly; Afrikaans is lazy-loaded on first switch. The `en.json` type is used as the canonical `MessageSchema` — all locales must match it structurally. When adding new keys, add to **both** `en.json` and `af.json`.

Inside `quizStore`, i18n is accessed directly via `i18n.global.t` (not `useI18n()`, since stores run outside component context).

### URL sharing

Results are encoded into the URL as three query params:
- `r` — base64url-packed answer values (3 bits each, `UNANSWERED_VALUE=7` for skipped)
- `m` — survey mode (currently always `metro`)
- `q` — comma-separated question IDs

`Results.vue` reads these on mount, calls `loadSurvey` then `loadAnswersFromUrl`, and uses `router.replace` to set the canonical URL (skipped if URL would exceed `URL_PARAMS.MAX_URL_LENGTH = 2000` chars).

### Adding content

**New question:** add metadata to `questions.json`, question text to both translation files under `questions.qN.text`, add it to relevant survey lists in `surveys.json`, and set party positions in `party_positions.json` for its axis.

**New party:** add to `parties.json` and `party_positions.json` (all 10 axes), add `party.<id>.desc` and `party.<id>.ideology` keys to both translation files.

**New i18n key:** add to `en.json` first (it is the type source), then mirror in `af.json`. The build will type-check coverage.

## Key constraints

- `party.colour` is always a 6-digit hex string (`#RRGGBB`) — relied on by the contrast utility in `PartyCard.vue`
- Party positions in `party_positions.json` must be in the `[-1, 1]` range per axis (enforced by `PartyPositionValueSchema` in `src/schemas/party-positions.ts`)
- `surveys.json` is validated at startup by `validateSurveys()` — the app throws on invalid data
- Locale persistence key is `"lang"`, mode persistence key is `"mode"` (localStorage)

### Testing

Component tests use `@vue/test-utils` and Vitest with `happy-dom`. Shared test utilities live in `src/test-utils/`. Key helpers:
- `makeEncodedAnswers(values, total)` — encode answer arrays into base64url for use in URL-based tests
