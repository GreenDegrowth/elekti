# Content & Localization Workflow

This guide covers how to add, modify, and manage quiz questions in Elekti.

## Adding a New Question

### 1. Choose an axis

Review `src/data/axes.json` and pick one of the 10 axes (e.g., `accountability`).

### 2. Understand the axis direction

Each axis has two poles:

- **Positive (+1)**: The pole described as positive in `axes.json`
- **Negative (-1)**: The opposite pole

Example: `accountability`
- Positive = strict audit culture, personal criminal liability, independent oversight
- Negative = flexible management, political discretion over financial decisions

### 3. Decide what your question measures

- Does your question ask about the **positive pole**? (e.g., "Should municipal managers face criminal liability for misconduct?") → Omit `direction` flag
- Does your question ask about the **negative pole**? (e.g., "Should councils have flexibility to override audit findings?") → Use `direction: "negative"`

For detailed guidance on axis poles and direction, see [Question Direction Guide](question-direction-guide.md).

### 4. Add to both translation files

Edit `src/data/translations/en.json` and `src/data/translations/af.json`:

```json
"q31": {
  "text": "Your question text here"
}
```

### 5. Add metadata to `src/data/questions.json`

```json
{
  "id": "q31",
  "textKey": "questions.q31.text",
  "axis": "accountability",
  "weight": 1.5,
  "direction": "negative"
}
```

- `id`: Unique identifier (q1 through q30 are taken; use q31 onwards for new questions)
- `textKey`: Path to translation (format: `questions.q[N].text`)
- `axis`: One of the 10 axis IDs from `axes.json`
- `weight`: Number from 1.0–2.0 (higher = more impact on scores)
- `direction`: Use `"negative"` **only if your question measures the negative pole**; omit otherwise

### 6. Set party positions

Update `src/data/party_positions.json` to set party stances on the new axis if needed. See [Party Position Reference](party-position-reference.md) for detailed guidance.

### 7. Verify

```sh
npm run test
```

All tests must pass before merging.

## Modifying a Question

### Text

Update in both translation files (`en.json` and `af.json`) under `questions.q[N].text`.

### Axis, Weight, or Direction

Edit `src/data/questions.json`:

- **Axis** – Determines which party positions affect scoring
- **Weight** – Scales the contribution (1.0–2.0)
- **Direction** – Update if you change the question's phrasing direction from positive pole to negative pole, or vice versa

If you modify which axis a question maps to, you may need to review/update party positions in `party_positions.json`.

### Run Tests

```sh
npm run test
```

## Removing a Question

1. Delete the question key from both `en.json` and `af.json` translation files
2. Remove the question object from `src/data/questions.json`
3. No other files need updates—question IDs remain stable

Run `npm run test` to verify.

## Localization & Translation

### Structure

All UI and question text lives in translation files:

- `src/data/translations/en.json` – English
- `src/data/translations/af.json` – Afrikaans

Questions reference their text via `textKey` in `questions.json` and are localised at runtime using `vue-i18n`.

### Adding a New Locale

1. Create `src/data/translations/[locale].json` with all keys from `en.json`
2. Update `src/i18n/i18n.ts` to register the new locale
3. Add locale to `availableLocales` in `i18n.ts`
4. Update UI locale selector in `src/components/LanguageSelector.vue`
5. Run `npm run test` to verify completeness

### Maintaining Translation Parity

The test suite (`src/data/validation.test.ts`) enforces that all locales have identical keys and full translations. If you add a question to `en.json`, **you must add it to `af.json` too**, or tests will fail.

## Conventions

- **Translation keys** use dot notation: `questions.q1.text`, `party.anc.desc`, `axes.service_delivery.short`
- **Question IDs** follow format `q[N]` (q1, q2, ..., q30 currently)
- **Axis IDs** use snake_case: `service_delivery`, `accountability`, `settlement_housing`
- **Party IDs** use lowercase alphanumeric: `anc`, `da`, `eff`
- **Text** uses British English spelling and grammar
