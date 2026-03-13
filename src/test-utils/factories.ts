import type { Party, PartyScore } from "../types";

let counter = 0;

export function makeParty(overrides: Partial<Party> = {}): Party {
  const id = overrides.id ?? `party-${++counter}`;
  return {
    id,
    name: `Test Party ${counter}`,
    short: `TP${counter}`,
    descriptionKey: `party.${id}.desc`,
    ideologyKey: `party.${id}.ideology`,
    colour: "#123456",
    website: `https://example.com/${id}`,
    ...overrides,
  };
}

export function makePartyScore(
  overrides: Partial<PartyScore> = {}
): PartyScore {
  const party = overrides.party ?? makeParty();
  return {
    partyId: party.id,
    alignmentScore: 0.75,
    axisScores: { economy: 0.75 },
    ...overrides,
    party,
  };
}
