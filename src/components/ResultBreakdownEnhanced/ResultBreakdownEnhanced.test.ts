import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../../test-utils/i18n";
import type { PartyScore } from "../../types";
import ResultBreakdownEnhanced from "./ResultBreakdownEnhanced.vue";

vi.mock("lucide-vue-next", () => ({
  ArrowUpDown: { template: "<span />" },
  LayoutGrid: { template: "<span />" },
  Table: { template: "<span />" },
}));

vi.mock("../PartyCard/PartyCard.vue", () => ({
  default: {
    name: "PartyCard",
    props: ["party", "score"],
    template: '<div class="party-card-stub">{{ party.name }}|{{ score }}</div>',
  },
}));

const i18n = createTestI18n();

const scores: PartyScore[] = [
  {
    partyId: "c",
    alignmentScore: 0.95,
    party: {
      id: "c",
      name: "Cedar",
      short: "CED",
      descriptionKey: "party.c.desc",
      ideologyKey: "party.c.ideology",
      colour: "#111111",
      website: "https://example.com/c",
    },
    axisScores: { economy: 0.4 },
  },
  {
    partyId: "a",
    alignmentScore: 0.91,
    party: {
      id: "a",
      name: "Aspen",
      short: "ASP",
      descriptionKey: "party.a.desc",
      ideologyKey: "party.a.ideology",
      colour: "#222222",
      website: "https://example.com/a",
    },
    axisScores: { economy: 0.9 },
  },
  {
    partyId: "b",
    alignmentScore: 0.73,
    party: {
      id: "b",
      name: "Birch",
      short: "BIR",
      descriptionKey: "party.b.desc",
      ideologyKey: "party.b.ideology",
      colour: "#333333",
      website: "https://example.com/b",
    },
    axisScores: { economy: 0.7 },
  },
];

describe("ResultBreakdownEnhanced", () => {
  it("starts in card view and can switch to table view", async () => {
    const wrapper = mount(ResultBreakdownEnhanced, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    expect(wrapper.find(".result-breakdown__list").exists()).toBe(true);
    expect(wrapper.find(".result-breakdown__table").exists()).toBe(false);

    await wrapper
      .find('button[aria-label="results.viewTable"]')
      .trigger("click");

    expect(wrapper.find(".result-breakdown__table").exists()).toBe(true);
    expect(wrapper.find(".result-breakdown__list").exists()).toBe(false);
  });

  it("sorts by score by default and toggles to name sorting", async () => {
    const wrapper = mount(ResultBreakdownEnhanced, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    await wrapper
      .find('button[aria-label="results.viewTable"]')
      .trigger("click");

    const namesByScore = wrapper
      .findAll(".result-breakdown__party-name")
      .map((n) => n.text());
    expect(namesByScore).toEqual(["Cedar", "Aspen", "Birch"]);

    await wrapper.find(".result-breakdown__sort-btn").trigger("click");

    const namesByName = wrapper
      .findAll(".result-breakdown__party-name")
      .map((n) => n.text());
    expect(namesByName).toEqual(["Aspen", "Birch", "Cedar"]);
  });

  it("shows comparison controls and emits selected parties", async () => {
    const wrapper = mount(ResultBreakdownEnhanced, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    await wrapper
      .find('button[aria-label="results.viewTable"]')
      .trigger("click");

    await wrapper
      .find('input[aria-label="Select Aspen for comparison"]')
      .setValue(true);
    await wrapper
      .find('input[aria-label="Select Birch for comparison"]')
      .setValue(true);

    expect(wrapper.text()).toContain("2 results.partiesSelected");

    await wrapper.find(".result-breakdown__compare-btn").trigger("click");

    const emitted = wrapper.emitted("compare");
    expect(emitted).toBeTruthy();
    const payload = emitted?.[0]?.[0] as PartyScore[];
    expect(payload).toHaveLength(2);
    expect(payload.map((p) => p.partyId)).toEqual(["a", "b"]);
  });

  it("clears comparison selection", async () => {
    const wrapper = mount(ResultBreakdownEnhanced, {
      props: { scores },
      global: { plugins: [i18n] },
    });

    await wrapper
      .find('button[aria-label="results.viewTable"]')
      .trigger("click");

    await wrapper
      .find('input[aria-label="Select Aspen for comparison"]')
      .setValue(true);

    expect(wrapper.find(".result-breakdown__comparison-bar").exists()).toBe(
      true
    );

    await wrapper.find(".result-breakdown__clear-btn").trigger("click");

    expect(wrapper.find(".result-breakdown__comparison-bar").exists()).toBe(
      false
    );
  });
});
