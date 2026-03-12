import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../../test-utils/i18n";
import type { PartyScore } from "../../types";
import PartyComparison from "./PartyComparison.vue";

vi.mock("lucide-vue-next", () => ({
  X: { template: "<span />" },
}));

vi.mock("../../utils/dataLoader", () => ({
  getAxes: () => [
    { id: "economy", shortNameKey: "axes.economy.short" },
    { id: "society", shortNameKey: "axes.society.short" },
  ],
}));

const i18n = createTestI18n();

const parties: PartyScore[] = [
  {
    partyId: "a",
    alignmentScore: 0.81,
    party: {
      id: "a",
      name: "Aspen",
      short: "ASP",
      descriptionKey: "party.a.desc",
      ideologyKey: "party.a.ideology",
      colour: "#111111",
      website: "https://example.com/a",
    },
    axisScores: { economy: 0.8, society: 0.5 },
  },
  {
    partyId: "b",
    alignmentScore: 0.67,
    party: {
      id: "b",
      name: "Birch",
      short: "BIR",
      descriptionKey: "party.b.desc",
      ideologyKey: "party.b.ideology",
      colour: "#222222",
      website: "https://example.com/b",
    },
    axisScores: { economy: 0.6, society: 0.4 },
  },
];

describe("PartyComparison", () => {
  function mountComparison(show: boolean) {
    return mount(PartyComparison, {
      props: { show, parties },
      global: {
        plugins: [i18n],
        stubs: { teleport: true },
      },
    });
  }

  it("does not render modal content when show is false", () => {
    const wrapper = mountComparison(false);

    expect(wrapper.find(".comparison-modal").exists()).toBe(false);
  });

  it("renders title, party names, and percentages when visible", () => {
    const wrapper = mountComparison(true);

    expect(wrapper.text()).toContain("results.compareParties");
    expect(wrapper.text()).toContain("Aspen");
    expect(wrapper.text()).toContain("Birch");
    expect(wrapper.text()).toContain("81.0%");
    expect(wrapper.text()).toContain("67.0%");
  });

  it("renders translated axis labels from mocked axes", () => {
    const wrapper = mountComparison(true);

    expect(wrapper.text()).toContain("axes.economy.short");
    expect(wrapper.text()).toContain("axes.society.short");
  });

  it("emits close when clicking overlay", async () => {
    const wrapper = mountComparison(true);

    await wrapper.find(".comparison-modal").trigger("click");

    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("emits close when clicking close button", async () => {
    const wrapper = mountComparison(true);

    await wrapper.find(".comparison-modal__close").trigger("click");

    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("does not emit close when clicking modal content", async () => {
    const wrapper = mountComparison(true);

    await wrapper.find(".comparison-modal__content").trigger("click");

    expect(wrapper.emitted("close")).toBeFalsy();
  });
});
