# Question Direction Guide

Understanding axis poles and question direction is critical for accurate political alignment scoring.

## Core Concept

Each axis has two poles (positive and negative). Questions can measure either pole. The `direction` flag tells the algorithm which pole a question measures, so it can correctly place user answers on the axis.

## Why Poles and Direction Matter

Consider `service_delivery`:

- **Positive pole (+1)**: State employees run municipal services directly (water, electricity, refuse, roads)
- **Negative pole (-1)**: Private contractors deliver services under performance contracts

Two questions on this axis:

- **Q1 (positive pole)**: "Municipal water and electricity services should be run directly by council staff rather than outsourced to private companies." → Agreement (+1) naturally maps to positive pole ✓
- **Q3 (negative pole)**: "Municipalities should partner with private investors through long-term concessions to upgrade and operate ageing water and sanitation infrastructure." → Agreement (+1) naturally maps to... positive pole? ✗

Without the direction flag, agreeing with Q3 would incorrectly suggest a pro-state-delivery stance. **The direction flag solves this.**

## The Inversion Mechanism

```typescript
// When a question measures the negative pole:
if (question.direction === "negative") {
  userValue = -userValue; // Flip the sign: +1 → -1, -0.5 → +0.5, etc.
}
```

**With the flag:**

- User agrees (+1) with Q3 "Municipalities should partner with private investors..."
- Algorithm inverts: +1 → -1
- Result: User correctly scores as pro-privatisation/outsourcing on the axis ✓

## Which Questions Have Direction Flags

| Axis                   | Question | Text summary                                                                 |
| ---------------------- | -------- | ---------------------------------------------------------------------------- |
| `service_delivery`     | Q3       | Municipalities should partner with private investors via long-term concessions |
| `settlement_housing`   | Q9       | Municipalities should enforce bylaws against land invasions quickly, even if this means evicting residents |
| `coalition_governance` | Q15      | Motions of no confidence in a mayor should require a two-thirds majority rather than a simple majority |
| `local_economy`        | Q30      | Local economic development should be led by private sector investment, with councils providing a favourable regulatory environment rather than direct intervention |

See `src/data/questions.json` for the authoritative list.

## How to Decide: The Flowchart

1. **Read the axis description** in `src/data/axes.json`
2. **Identify the positive pole** (the +1 direction)
3. **Read your question**
4. **Does your question ask about the POSITIVE pole?**
   - YES → Omit `direction` field (or use `direction: "positive"` explicitly)
   - NO → Add `direction: "negative"`

## Examples with Full Scoring

### Example A: EFF supporter answers Q1 (positive pole, no flag)

- **Question**: "Municipal water and electricity services should be run directly by council staff rather than outsourced to private companies."
- **Axis**: `service_delivery` (positive = state-run, negative = private contractors)
- **Direction flag**: None
- **EFF supporter answer**: Strongly Agree (+1)
- **Algorithm**: No direction flag, so +1 stays +1
- **Result on axis**: +1 (pro-state-delivery) ✓ (EFF favours state-run services)

### Example B: DA supporter answers Q3 (negative pole, with flag)

- **Question**: "Municipalities should partner with private investors through long-term concessions to upgrade and operate ageing water and sanitation infrastructure."
- **Axis**: `service_delivery`
- **Direction flag**: `"negative"`
- **DA supporter answer**: Strongly Agree (+1)
- **Algorithm**: Direction flag applies, so +1 → -1
- **Result on axis**: -1 (pro-outsourcing/private delivery) ✓ (DA favours private sector delivery)

### Example C: ActionSA supporter answers Q15 (negative pole, with flag)

- **Question**: "Motions of no confidence in a mayor should require a two-thirds majority rather than a simple majority."
- **Axis**: `coalition_governance` (positive = transparent/structured coalitions with accountability, negative = executive flexibility and informal deals)
- **Direction flag**: `"negative"`
- **ActionSA supporter answer**: Strongly Agree (+1)
- **Algorithm**: Direction flag applies, so +1 → -1
- **Result on axis**: -1 (pro-executive-flexibility) ✓ (requiring supermajority protects incumbents, reduces coalition accountability)

## Testing Your Understanding

When adding a new question:

1. Write the question from a natural perspective (don't force awkward phrasing)
2. Decide which pole it naturally measures
3. If it measures the negative pole, add `direction: "negative"`
4. Run `npm run test` to verify

The scoring algorithm will handle the rest. The tests also validate that all documented direction flags match the actual data.
