import type { VueWrapper } from "@vue/test-utils";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TIMING } from "../utils/constants";
import Quiz from "./Quiz.vue";

const { routerPushMock, storeMock } = vi.hoisted(() => ({
  routerPushMock: vi.fn(),
  storeMock: {
    currentQuestionIndex: 0,
    questions: [
      { id: "q1", textKey: "questions.q1.text" },
      { id: "q2", textKey: "questions.q2.text" },
    ],
    currentQuestion: { id: "q1", textKey: "questions.q1.text" },
    answers: {} as Record<string, number>,
    progress: 0,
    answerQuestion: vi.fn(),
    nextQuestion: vi.fn(),
    previousQuestion: vi.fn(),
    skipQuestion: vi.fn(),
    setCompleted: vi.fn(),
  },
}));

vi.mock("lucide-vue-next", () => ({
  ChevronLeft: { template: "<span />" },
  ChevronRight: { template: "<span />" },
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock("../stores/quizStore", () => ({
  useQuizStore: () => storeMock,
}));

vi.mock("../components/ProgressBar/ProgressBar.vue", () => ({
  default: {
    name: "ProgressBar",
    props: ["progress"],
    template: '<div class="progress-bar-stub"><slot /></div>',
  },
}));

vi.mock("../components/QuizQuestion/QuizQuestion.vue", () => ({
  default: {
    name: "QuizQuestion",
    props: ["question", "modelValue", "disabled"],
    emits: ["update:modelValue"],
    template:
      '<button class="quiz-question-stub" @click="$emit(\'update:modelValue\', 2)">answer</button>',
  },
}));

describe("Quiz view", () => {
  let mountedWrappers: VueWrapper[] = [];

  beforeEach(() => {
    routerPushMock.mockReset();
    storeMock.answerQuestion.mockReset();
    storeMock.nextQuestion.mockReset();
    storeMock.previousQuestion.mockReset();
    storeMock.skipQuestion.mockReset();
    storeMock.setCompleted.mockReset();

    storeMock.currentQuestionIndex = 0;
    storeMock.currentQuestion = { id: "q1", textKey: "questions.q1.text" };
    storeMock.questions = [
      { id: "q1", textKey: "questions.q1.text" },
      { id: "q2", textKey: "questions.q2.text" },
    ];
    storeMock.answers = {};
    storeMock.progress = 0;

    vi.useRealTimers();
    mountedWrappers = [];
  });

  afterEach(() => {
    for (const wrapper of mountedWrappers) {
      wrapper.unmount();
    }
    vi.useRealTimers();
  });

  it("disables next when current question is unanswered", () => {
    const wrapper = mount(Quiz, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    mountedWrappers.push(wrapper);

    const nextButton = wrapper.find('[data-testid="nav-next"]');
    expect(nextButton.exists()).toBe(true);
    expect(nextButton.attributes("disabled")).toBeDefined();
  });

  it("shows back button and calls previousQuestion when clicked", async () => {
    storeMock.currentQuestionIndex = 1;
    storeMock.currentQuestion = { id: "q2", textKey: "questions.q2.text" };
    storeMock.answers = { q2: 1 };

    const wrapper = mount(Quiz, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    mountedWrappers.push(wrapper);

    const backButton = wrapper.find('[data-testid="nav-back"]');
    expect(backButton.exists()).toBe(true);

    await backButton.trigger("click");
    expect(storeMock.previousQuestion).toHaveBeenCalledTimes(1);
  });

  it("advances when ArrowRight is pressed and current question is answered", async () => {
    storeMock.answers = { q1: 3 };

    const wrapper = mount(Quiz, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    mountedWrappers.push(wrapper);

    globalThis.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowRight",
      })
    );

    expect(storeMock.nextQuestion).toHaveBeenCalledTimes(1);
  });

  it("handles answer emit with delay before moving to next question", async () => {
    vi.useFakeTimers();

    const wrapper = mount(Quiz, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    mountedWrappers.push(wrapper);

    await wrapper.find(".quiz-question-stub").trigger("click");

    expect(storeMock.answerQuestion).toHaveBeenCalledWith("q1", 2);
    expect(storeMock.nextQuestion).not.toHaveBeenCalled();

    vi.advanceTimersByTime(TIMING.ANSWER_DELAY + TIMING.TRANSITION_RESET);

    expect(storeMock.nextQuestion).toHaveBeenCalledTimes(1);
  });

  it("finishes quiz on last question", async () => {
    storeMock.currentQuestionIndex = 1;
    storeMock.currentQuestion = { id: "q2", textKey: "questions.q2.text" };
    storeMock.answers = { q2: 4 };

    const wrapper = mount(Quiz, {
      global: {
        mocks: { $t: (key: string) => key },
      },
    });
    mountedWrappers.push(wrapper);

    const finishButton = wrapper.find('[data-testid="nav-finish"]');
    expect(finishButton.exists()).toBe(true);

    await finishButton.trigger("click");

    expect(storeMock.setCompleted).toHaveBeenCalledWith(true);
    expect(routerPushMock).toHaveBeenCalledWith("/results");
  });
});
