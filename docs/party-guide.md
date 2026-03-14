# Parties & Maintenance

## Parties Included

The quiz currently includes 17 South African political parties:

1. **ANC** (African National Congress) - Centre-left governing party
2. **DA** (Democratic Alliance) - Centre-right liberal opposition
3. **EFF** (Economic Freedom Fighters) - Far-left radical transformation
4. **IFP** (Inkatha Freedom Party) - Centrist, Zulu-focused, conservative
5. **MK** (uMkhonto we Sizwe Party) - Left-wing, Zuma-led
6. **PA** (Patriotic Alliance) - Right-wing nationalist
7. **VF+** (Freedom Front Plus) - Right-wing, Afrikaner-focused
8. **ActionSA** - Centre-right, anti-corruption focus
9. **ACDP** (African Christian Democratic Party) - Christian conservative
10. **UFC** (Unite for Change) - Centrist progressive
11. **UDM** (United Democratic Movement) - Centre-left, pro-institution
12. **SACP** (South African Communist Party) - Far-left socialist
13. **ATM** (African Transformation Movement) - Centre-right Christian democratic
14. **Al Jama-ah** - Islamic democratic, socially conservative
15. **NCC** (National Coloured Congress) - Coloured community representation
16. **PAC** (Pan Africanist Congress of Azania) - Black nationalist, African socialist
17. **COPE** (Congress of the People) - Centrist, pro-accountability

Full metadata and axes positions are in:
- `src/data/parties.json` – Party names, colors, websites, descriptions
- `src/data/party_positions.json` – Party positions on all 10 axes (-1 to +1)

## Adding a New Party

### 1. Research party positions

Review official manifestos, parliamentary voting records, and verified public statements to understand the party's stance on each of the 10 axes.

### 2. Add to `src/data/parties.json`

```json
{
  "id": "newparty",
  "name": "New Party",
  "short": "NP",
  "descriptionKey": "party.newparty.desc",
  "ideologyKey": "party.newparty.ideology",
  "colour": "#FF5733",
  "website": "https://www.newparty.org/"
}
```

- `id`: Lowercase, no spaces (e.g., `newparty`)
- `name`: Full official name
- `short`: Abbreviation for display
- `descriptionKey`: Reference to translation (format: `party.[id].desc`)
- `ideologyKey`: Reference to ideology translation (format: `party.[id].ideology`)
- `colour`: Hex color code for UI display
- `website`: Official party website URL

### 3. Add to `src/data/party_positions.json`

For each of the 10 axes, determine position (-1 to +1) by:

1. **Read all questions on that axis** – Check `src/data/questions.json` for every question with this axis ID
2. **Estimate the party's typical answer** – Using manifestos, voting records, public positions
3. **Account for direction flags** – Remember the algorithm inverts negative-pole questions (see [Question Direction Guide](../docs/question-direction-guide.md))
4. **Average estimates** across all questions on that axis
5. **Round to 1 decimal place**

Example:

```json
{
  "newparty": {
    "service_delivery": 0.2,
    "accountability": 0.5,
    "settlement_housing": 0.1,
    "tariffs_affordability": 0.2,
    "coalition_governance": 0.4,
    "public_transport": 0.3,
    "land_densification": 0.2,
    "metro_safety": 0.3,
    "community_participation": 0.4,
    "local_economy": 0.1
  }
}
```

**All 10 axes are required.** See [Party Position Reference](party-position-reference.md) for detailed worked examples of how to set positions.

### 4. Add translations

Edit both `src/data/translations/en.json` and `src/data/translations/af.json`:

```json
{
  "party": {
    "newparty": {
      "desc": "English description of the new party...",
      "ideology": "English ideology/positioning statement..."
    }
  }
}
```

Both languages must have complete translations or tests will fail.

### 5. Verify

```sh
npm run test
```

All tests must pass. The validation suite will check:
- All parties have positions on all 10 axes
- No duplicate party IDs
- All translation strings exist in both languages
- All position values are between -1 and +1

Then manually test the quiz to ensure the party appears correctly in results and matches align sensibly.

## Updating Party Positions

If a party's policy focus shifts significantly:

1. Review current positions in `src/data/party_positions.json`
2. Re-read recent manifestos and public statements
3. Consider how the party's supporters would answer current questions
4. Update relevant axis positions (not all axes need to change)
5. Run `npm run test` to verify
6. Commit with a clear message: "Update [Party] positions on [axes]"

## Removing a Party

1. Delete the party object from `src/data/parties.json`
2. Delete the party from `src/data/party_positions.json`
3. Delete the party translations from both `src/data/translations/en.json` and `src/data/translations/af.json`
4. Run `npm run test` to verify

## Notes on Positioning

- **Avoid extremes** – Use -1 or +1 sparingly; most parties should be in [-0.8, 0.8] range
- **Be consistent** – If party A scores 0.5 on an axis, party B should too if their positions are actually similar
- **Document reasoning** – In commit messages, briefly explain why a position changed
- **Consider time** – Positions may drift with leadership changes or policy shifts

## Questions About Party Positions?

Consult [Party Position Reference](party-position-reference.md) for:
- Detailed explanation of each axis and its poles
- Worked examples showing how to set positions for specific parties
- Best practices for research and curation
