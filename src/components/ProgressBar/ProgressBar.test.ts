import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ProgressBar from "./ProgressBar.vue";

describe("ProgressBar", () => {
  it("renders progressbar accessibility attributes", () => {
    const wrapper = mount(ProgressBar, {
      props: { progress: 42.4 },
    });

    const bar = wrapper.find('[role="progressbar"]');
    expect(bar.exists()).toBe(true);
    expect(bar.attributes("aria-valuenow")).toBe("42.4");
    expect(bar.attributes("aria-valuemin")).toBe("0");
    expect(bar.attributes("aria-valuemax")).toBe("100");
    expect(bar.attributes("aria-label")).toBe("42% complete");
    expect(bar.attributes("aria-valuetext")).toBe("42% complete");
  });

  it("applies the fill width style from progress", () => {
    const wrapper = mount(ProgressBar, {
      props: { progress: 67 },
    });

    expect(
      wrapper.find('[data-testid="progress-fill"]').attributes("style")
    ).toContain("width: 67%");
  });

  it("renders slot content when provided", () => {
    const wrapper = mount(ProgressBar, {
      props: { progress: 10 },
      slots: {
        default: "Some label text",
      },
    });

    expect(wrapper.find('[data-testid="progress-label"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Some label text");
  });

  it("does not render label container when slot is absent", () => {
    const wrapper = mount(ProgressBar, {
      props: { progress: 10 },
    });

    expect(wrapper.find('[data-testid="progress-label"]').exists()).toBe(false);
  });
});
