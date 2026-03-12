import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../../test-utils/i18n";
import type { PartyScore } from "../../types";
import ResultBreakdown from "./ResultBreakdown.vue";

vi.mock("../PartyCard/PartyCard.vue", () => ({
  default: {
    name: "PartyCard",
    props: ["party", "score"],
    template:
      '<div class="party-card-stub">{{ party.name }}|{{ Number(score).toFixed(1) }}</div>',
  },
}));

const i18n = createTestI18n();

const scores: PartyScore[] = [
  {
    partyId: "a",
    alignmentScore: 0.71,
    party: {
      id: "a",
      name: "Alpha Party",
      short: "ALP",
      descriptionKey: "party.a.desc",
      ideologyKey: "party.a.ideology",
      colour: "#123456",
      website: "https://example.com/a",
    },
    axisScores: { economy: 0.7 },
  },
  {
    partyId: "b",
    alignmentScore: 0.62,
    party: {
      id: "b",
      name: "Beta Party",
      short: "BET",
      descriptionKey: "party.b.desc",
      ideologyKey: "party.b.ideology",
      colour: "#654321",
      website: "https://example.com/b",
    },
    axisScores: { economy: 0.6 },
  },
];

describe("ResultBreakdown", () => {
  it("renders translated title key", () => {
    const wrapper = mount(ResultBreakdown, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    expect(wrapper.find(".result-breakdown__title").text()).toBe(
      "results.otherParties"
    );
  });

  it("renders one PartyCard per score", () => {
    const wrapper = mount(ResultBreakdown, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    const cards = wrapper.findAll(".party-card-stub");
    expect(cards).toHaveLength(2);
    expect(cards[0].text()).toContain("Alpha Party");
    expect(cards[1].text()).toContain("Beta Party");
  });

  it("renders no cards when scores are empty", () => {
    const wrapper = mount(ResultBreakdown, {
      props: { scores: [] },
      global: { plugins: [i18n] },
    });

    expect(wrapper.findAll(".party-card-stub")).toHaveLength(0);
  });
});
