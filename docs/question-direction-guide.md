# Question Direction Guide

Understanding axis poles and question direction is critical for accurate political alignment scoring.

## Core Concept

Each axis has two poles (positive and negative). Questions can measure either pole. The `direction` flag tells the algorithm which pole a question measures, so it can correctly place user answers on the axis.

## Why Poles and Direction Matter

Consider `law_order_vs_liberty`:

- **Positive pole (+1)**: Civil liberties prioritised, protest rights protected, scrutiny of state power
- **Negative pole (-1)**: Law & order prioritised, strong policing, restrictions on disruptive protest

Two questions on this axis:

- **Q22 (positive pole)**: "Should people be free to protest?" → Agreement (+1) naturally maps to positive pole ✓
- **Q21 (negative pole)**: "Should police have stronger powers?" → Agreement (+1) naturally maps to... positive pole? ✗

Without the direction flag, agreeing with "stronger police powers" would incorrectly suggest civil libertarian views. **The direction flag solves this.**

## The Inversion Mechanism

```typescript
// When a question measures the negative pole:
if (question.direction === "negative") {
  userValue = -userValue; // Flip the sign: +1 → -1, -0.5 → +0.5, etc.
}
```

**With the flag:**

- User agrees (+1) with Q21 "Police should have more power"
- Algorithm inverts: +1 → -1
- Result: User correctly scores as pro-law-and-order on the axis ✓

## Which Questions Have Direction Flags

| Axis                           | Questions measuring negative pole                              |
| ------------------------------ | -------------------------------------------------------------- |
| `economic_left_right`          | Q2 (cut debt), Q8 (cut taxes)                                  |
| `state_vs_market`              | Q9 (cut red tape), Q11 (privatise power)                       |
| `labour_rights`                | Q19 (labour flexibility)                                       |
| `law_order_vs_liberty`         | Q21 (police power), Q23 (limit protests)                       |
| `global_vs_local`              | Q38 (tariffs), Q39 (immigration), Q40 (crack down on migrants) |
| `transformation_vs_continuity` | Q43 (incremental reform)                                       |

See `src/data/questions.json` for the authoritative list.

## How to Decide: The Flowchart

1. **Read the axis description** in `src/data/axes.json`
2. **Identify the positive pole** (the +1 direction)
3. **Read your question**
4. **Does your question ask about the POSITIVE pole?**
   - YES → Omit `direction` field (use `direction: "positive"` or leave empty)
   - NO → Add `direction: "negative"`

## Examples with Full Scoring

### Example A: EFF supporter answers Q22 (positive pole, no flag)

- **Question**: "Should people be free to protest?"
- **Axis**: `law_order_vs_liberty` (positive = civil liberties, negative = law & order)
- **Direction flag**: None
- **EFF supporter answer**: Strongly Agree (+1)
- **Algorithm**: No direction flag, so +1 stays +1
- **Result on axis**: +1 (pro-civil-liberties) ✓ (EFF is indeed pro-protest)

### Example B: MK supporter answers Q21 (negative pole, with flag)

- **Question**: "Should police have stronger powers?"
- **Axis**: `law_order_vs_liberty`
- **Direction flag**: `"negative"`
- **MK supporter answer**: Strongly Agree (+1)
- **Algorithm**: Direction flag applies, so +1 → -1
- **Result on axis**: -1 (pro-law-and-order) ✓ (MK has authoritarian tendencies)

### Example C: DA supporter answers Q2 (negative pole, with flag)

- **Question**: "Government should pay down debt rather than spend"
- **Axis**: `economic_left_right` (positive = left/spend, negative = right/save)
- **Direction flag**: `"negative"`
- **DA supporter answer**: Strongly Agree (+1)
- **Algorithm**: Direction flag applies, so +1 → -1
- **Result on axis**: -1 (right-leaning) ✓ (DA is indeed economically right-wing)

## Testing Your Understanding

When adding a new question:

1. Write the question from a natural perspective (don't force awkward phrasing)
2. Decide which pole it naturally measures
3. If it measures the negative pole, add `direction: "negative"`
4. Run `npm run test` to verify

The scoring algorithm will handle the rest. The tests also validate that all documented direction flags match the actual data.
