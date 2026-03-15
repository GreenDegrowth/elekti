# Elekti

> A multilingual political alignment quiz that matches South African voters to parties via weighted scoring.

Elekti is a Vue 3 + TypeScript SPA that walks users through 30 policy questions, normalises their answers against curated party data, and surfaces tailored recommendations. Axis-based deterministic scoring, full localization, and URL-shareable results.

## Highlights

- 🎯 **Policy matching** – 30 questions mapped to 10 political axes; weighted scoring determines party alignment
- 🌍 **Fully localized** – All text in `src/data/translations/{en,af}.json`; metadata references via `textKey`
- 🧠 **Deterministic scoring** – Axis-based alignment, not text matching; reproducible results with similarity normalization
- 🧭 **Shareable results** – Encode quiz answers into URL for deep-linking across locales
- ⚙️ **Vue 3 + Pinia** – TypeScript-first, Vite bundler, vue-i18n, vue-router, fast HMR

## Getting Started

Prerequisites: Node >= 22.21.1

```sh
npm install
npm run dev          # http://localhost:5173
npm run test         # Vitest + happy-dom
npm run build        # TypeScript strict mode enforced
```

### Keyboard Shortcuts (During Quiz)

- **1-5** – Select answer options
- **Arrow Left/Right** – Navigate questions
- **Enter** – Proceed to next question


## Architecture

```
src/
├── components/       # QuizQuestion, PartyCard, ResultBreakdown
├── data/            # JSON: questions, axes, parties, party_positions, translations
├── stores/          # Pinia: quizStore (answers, progress), uiStore (locale)
├── utils/           # scoring.ts, constants.ts, dataLoader.ts
└── views/           # Landing, Quiz, Results, About (vue-router)
```

- **State**: `quizStore` loads questions from i18n, manages quiz progress; `uiStore` handles locale persistence
- **Scoring**: `computeScores()` calculates axis similarity, returns ranked parties with top 3 contributing axes
- **Data**: 30 questions × 10 axes; each question has weight, textKey, optional `direction: "negative"` flag

## Key Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Type-check + bundle (fails on type errors) |
| `npm run test` / `test:ui` | Vitest; UI opens test inspector |
| `npm run lint` | oxlint + ESLint with autofix |
| `npm run format` | Prettier + organize-imports |

## 📚 Detailed Guides

Full documentation is split into dedicated guides:

- **[Content Workflow](docs/content-workflow.md)** – Adding/modifying/removing questions step-by-step
- **[Question Direction Guide](docs/question-direction-guide.md)** – Understanding axis poles and the `direction: "negative"` flag with examples
- **[Scoring Algorithm](docs/scoring-algorithm.md)** – Deep dive into axis-based similarity scoring and confidence levels
- **[Party Position Reference](docs/party-position-reference.md)** – How to set party positions with worked examples
- **[Parties & Maintenance](docs/party-guide.md)** – List of 17 parties; adding/updating party positions

Each guide covers one topic in detail so you can find what you need quickly.


## Testing & Quality

- Tests cover scoring, stores, router, i18n, and data validation (190+ tests)
- Vitest runs in `happy-dom` environment; full type checking on all builds
- All UI text is translated; locale persistence via `localStorage`

## Tooling

- **TypeScript** – Strict mode; build fails on type errors
- **Linting** – ESLint with autofix
- **Bundler** – Vite with Rolldown
- **i18n** – Fallback locale `en`; all locales must be complete

## Contributing

1. Branch from `main`
2. Keep tests, types, and lint checks green:
   ```sh
   npm run lint && npm run test && npm run build
   ```
3. **Adding questions?** See [Content Workflow](docs/content-workflow.md)
   - Add to **both** `en.json` and `af.json`
   - Add metadata to `questions.json` with optional `direction: "negative"`
   - Set party positions in `party_positions.json` for affected axes
4. **Adding a party?** See [Parties & Maintenance](docs/party-guide.md)

---

Have ideas, new questions, or found an alignment issue? Open an issue or start a discussion.

## License

[GNU General Public License v3.0 only](https://opensource.org/license/gpl-3-0-only) — © 2025 Timothy Brits
