import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { Question } from "../types";
import QuizQuestion from "./QuizQuestion.vue";

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => {
      const labels: Record<string, string> = {
        "options.stronglyAgree": "Strongly agree",
        "options.agree": "Agree",
        "options.neutral": "Neutral",
        "options.disagree": "Disagree",
        "options.stronglyDisagree": "Strongly disagree",
      };
      return labels[key] ?? key;
    },
  }),
}));

vi.mock("./QuizOption.vue", () => ({
  default: {
    name: "QuizOption",
    template: `<button class="quiz-option" :data-selected="isSelected" @click="$emit('select')">{{ label }}</button>`,
    props: ["label", "isSelected", "disabled"],
    emits: ["select"],
  },
}));

const mockQuestion: Question = {
  id: "q1",
  text: "Should the government increase public spending?",
  textKey: "questions.q1.text",
  axis: "economy",
  weight: 1.5,
  options: [],
};

describe("QuizQuestion", () => {
  it("renders the question text from textKey", () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    // The component calls t(question.textKey) which returns the key in our mock
    expect(wrapper.find(".quiz-question__text").text()).toBe(
      "questions.q1.text"
    );
  });

  it("renders five option buttons", () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    expect(wrapper.findAll(".quiz-option")).toHaveLength(5);
  });

  it("emits update:modelValue when an option is selected", async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion },
    });
    await wrapper.findAll(".quiz-option")[2].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([2]);
  });

  it("does not emit when disabled", async () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion, disabled: true },
    });
    await wrapper.findAll(".quiz-option")[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("reflects modelValue as the initially selected option", () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion, modelValue: 3 },
    });
    const options = wrapper.findAll(".quiz-option");
    expect(options[3].attributes("data-selected")).toBe("true");
  });

  it("applies disabled class to options container when disabled", () => {
    const wrapper = mount(QuizQuestion, {
      props: { question: mockQuestion, disabled: true },
    });
    expect(wrapper.find(".quiz-question__options").classes()).toContain(
      "quiz-question__options--disabled"
    );
  });
});
