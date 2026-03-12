import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../../test-utils/i18n";
import ConfidenceIndicator from "./ConfidenceIndicator.vue";

vi.mock("lucide-vue-next", () => ({
  HelpCircle: { template: "<span />" },
  TrendingDown: { template: "<span />" },
  TrendingUp: { template: "<span />" },
}));

const i18n = createTestI18n();
const globalConfig = { plugins: [i18n] };

function mountIndicator(confidence: "high" | "medium" | "low") {
  return mount(ConfidenceIndicator, {
    props: { confidence, primaryScore: 0.8, alternativeScores: [0.6] },
    global: globalConfig,
  });
}

describe("ConfidenceIndicator", () => {
  it("applies the correct modifier class for high confidence", () => {
    const wrapper = mountIndicator("high");
    expect(wrapper.classes()).toContain("confidence-indicator--high");
  });

  it("applies the correct modifier class for medium confidence", () => {
    const wrapper = mountIndicator("medium");
    expect(wrapper.classes()).toContain("confidence-indicator--medium");
  });

  it("applies the correct modifier class for low confidence", () => {
    const wrapper = mountIndicator("low");
    expect(wrapper.classes()).toContain("confidence-indicator--low");
  });

  it("renders the translated label text", () => {
    const wrapper = mountIndicator("high");
    expect(wrapper.text()).toContain("results.confidence.high");
  });

  it("does not show the tooltip by default", () => {
    const wrapper = mountIndicator("high");
    expect(wrapper.find(".confidence-indicator__tooltip").exists()).toBe(false);
  });

  it("shows the tooltip after click", async () => {
    const wrapper = mountIndicator("medium");
    await wrapper.trigger("click");
    expect(wrapper.find(".confidence-indicator__tooltip").exists()).toBe(true);
  });

  it("hides the tooltip after second click", async () => {
    const wrapper = mountIndicator("low");
    await wrapper.trigger("click");
    await wrapper.trigger("click");
    expect(wrapper.find(".confidence-indicator__tooltip").exists()).toBe(false);
  });

  it("displays primary score percentage in the tooltip", async () => {
    const wrapper = mountIndicator("high");
    await wrapper.trigger("click");
    expect(wrapper.text()).toContain("80.0%");
  });

  it("displays alternative score in the tooltip", async () => {
    const wrapper = mountIndicator("high");
    await wrapper.trigger("click");
    expect(wrapper.text()).toContain("60.0%");
  });
});
