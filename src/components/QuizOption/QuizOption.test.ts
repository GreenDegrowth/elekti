import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import QuizOption from "./QuizOption.vue";

describe("QuizOption", () => {
  it("renders radio semantics and label text", () => {
    const wrapper = mount(QuizOption, {
      props: {
        label: "Agree",
        isSelected: false,
      },
    });

    const button = wrapper.find('[data-testid="quiz-option"]');
    expect(button.attributes("role")).toBe("radio");
    expect(button.attributes("aria-checked")).toBe("false");
    expect(button.attributes("aria-disabled")).toBe("false");
    expect(wrapper.text()).toContain("Agree");
  });

  it("emits select on click", async () => {
    const wrapper = mount(QuizOption, {
      props: {
        label: "Agree",
        isSelected: false,
      },
    });

    await wrapper.find('[data-testid="quiz-option"]').trigger("click");
    expect(wrapper.emitted("select")).toHaveLength(1);
  });

  it("emits select on Enter and Space keydown", async () => {
    const wrapper = mount(QuizOption, {
      props: {
        label: "Neutral",
        isSelected: false,
      },
    });

    const button = wrapper.find('[data-testid="quiz-option"]');
    await button.trigger("keydown.enter");
    await button.trigger("keydown.space");

    expect(wrapper.emitted("select")).toHaveLength(2);
  });

  it("applies selected modifier class and aria state", () => {
    const wrapper = mount(QuizOption, {
      props: {
        label: "Option",
        isSelected: true,
      },
    });

    const button = wrapper.find('[data-testid="quiz-option"]');
    expect(button.classes()).toContain("quiz-option--selected");
    expect(button.attributes("aria-checked")).toBe("true");
  });

  it("forwards disabled state to the button", () => {
    const wrapper = mount(QuizOption, {
      props: {
        label: "Option",
        isSelected: false,
        disabled: true,
      },
    });

    const button = wrapper.find('[data-testid="quiz-option"]');
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.attributes("aria-disabled")).toBe("true");
  });
});
