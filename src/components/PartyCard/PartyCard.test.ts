import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../../test-utils/i18n";
import type { Party } from "../../types";
import PartyCard from "./PartyCard.vue";

vi.mock("lucide-vue-next", () => ({
  ChevronDown: { template: "<span />" },
  ExternalLink: { template: "<span />" },
}));

vi.mock("../../utils/dataLoader", () => ({
  getAxes: () => [
    { id: "axis1", name: "Economy", shortNameKey: "axes.axis1.short" },
    { id: "axis2", name: "Society", shortNameKey: "axes.axis2.short" },
  ],
}));

vi.mock("../../utils/colorUtils", () => ({
  badgeTextColor: () => "#ffffff",
  formatPercentage: (score: number) => (score * 100).toFixed(1),
  getAxisColor: () => "#1f7a51",
}));

const i18n = createTestI18n();
const globalConfig = { plugins: [i18n] };

const mockParty: Party = {
  id: "anc",
  name: "African National Congress",
  short: "ANC",
  descriptionKey: "party.anc.desc",
  ideologyKey: "party.anc.ideology",
  colour: "#007a4d",
  website: "https://www.anc.org.za",
};

function mountCard(
  overrides: Partial<{
    score: number;
    axisScores: Record<string, number>;
  }> = {}
) {
  return mount(PartyCard, {
    props: { party: mockParty, ...overrides },
    global: globalConfig,
  });
}

describe("PartyCard", () => {
  it("renders the party name", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("African National Congress");
  });

  it("renders the party short code", () => {
    const wrapper = mountCard();
    expect(wrapper.text()).toContain("ANC");
  });

  it("applies the party colour as a CSS custom property", () => {
    const wrapper = mountCard();
    const style = wrapper.attributes("style");
    expect(style).toContain("--party-colour: #007a4d");
  });

  it("renders the score percentage when score is provided", () => {
    const wrapper = mountCard({ score: 0.75 });
    expect(wrapper.text()).toContain("75.0%");
  });

  it("does not render the score bar when score is omitted", () => {
    const wrapper = mountCard();
    expect(wrapper.find('[data-testid="party-score"]').exists()).toBe(false);
  });

  it("renders the external website link", () => {
    const wrapper = mountCard();
    const link = wrapper.find('[data-testid="party-website"]');
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("https://www.anc.org.za");
    expect(link.attributes("rel")).toContain("noopener");
  });

  it("does not render the expand button without axisScores", () => {
    const wrapper = mountCard({ score: 0.5 });
    expect(wrapper.find('[data-testid="party-expand"]').exists()).toBe(false);
  });

  it("shows the axis breakdown after clicking expand", async () => {
    const wrapper = mountCard({
      score: 0.6,
      axisScores: { axis1: 0.8, axis2: 0.4 },
    });
    const btn = wrapper.find('[data-testid="party-expand"]');
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");
    expect(wrapper.find('[data-testid="party-axes"]').exists()).toBe(true);
  });
});
