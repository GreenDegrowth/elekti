import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestI18n } from "../test-utils/i18n";
import type { PartyScore } from "../types";
import Results from "./Results.vue";

const {
  routerPushMock,
  loaderState,
  quizStoreMock,
  writeTextMock,
  partyScores,
} = vi.hoisted(() => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const makeRef = <T>(initial: T) => {
    let current = initial;
    return {
      __v_isRef: true,
      get value() {
        return current;
      },
      set value(next: T) {
        current = next;
      },
    };
  };

  type ResultViewModel = {
    primary: PartyScore;
    alternatives: PartyScore[];
    allScores: PartyScore[];
    confidence: "high" | "medium" | "low";
  };

  const allScores: PartyScore[] = [
    {
      partyId: "p1",
      alignmentScore: 0.9,
      party: {
        id: "p1",
        name: "Primary Party",
        short: "P1",
        descriptionKey: "party.p1.desc",
        ideologyKey: "party.p1.ideology",
        colour: "#111111",
        website: "https://example.com/p1",
      },
      axisScores: { economy: 0.9 },
    },
    {
      partyId: "p2",
      alignmentScore: 0.8,
      party: {
        id: "p2",
        name: "Alt One",
        short: "P2",
        descriptionKey: "party.p2.desc",
        ideologyKey: "party.p2.ideology",
        colour: "#222222",
        website: "https://example.com/p2",
      },
      axisScores: { economy: 0.8 },
    },
    {
      partyId: "p3",
      alignmentScore: 0.7,
      party: {
        id: "p3",
        name: "Alt Two",
        short: "P3",
        descriptionKey: "party.p3.desc",
        ideologyKey: "party.p3.ideology",
        colour: "#333333",
        website: "https://example.com/p3",
      },
      axisScores: { economy: 0.7 },
    },
    {
      partyId: "p4",
      alignmentScore: 0.6,
      party: {
        id: "p4",
        name: "Other Party",
        short: "P4",
        descriptionKey: "party.p4.desc",
        ideologyKey: "party.p4.ideology",
        colour: "#444444",
        website: "https://example.com/p4",
      },
      axisScores: { economy: 0.6 },
    },
  ];

  return {
    routerPushMock: vi.fn(),
    writeTextMock: vi.fn().mockResolvedValue(),
    quizStoreMock: {
      mode: "metro",
      questions: [{ id: "q1" }, { id: "q2" }],
      encodeAnswersToUrl: vi.fn(() => "encoded"),
      reset: vi.fn(),
    },
    loaderState: {
      result: makeRef<ResultViewModel | undefined>({
        primary: allScores[0],
        alternatives: [allScores[1], allScores[2]],
        allScores,
        confidence: "high",
      }),
      error: makeRef(undefined as string | undefined),
      loading: makeRef(false),
    },
    partyScores: allScores,
  };
});

vi.mock("lucide-vue-next", () => ({
  AlertCircle: { template: "<span />" },
  Copy: { template: "<span />" },
  RotateCcw: { template: "<span />" },
  Trophy: { template: "<span />" },
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock("../stores/quizStore", () => ({
  useQuizStore: () => quizStoreMock,
}));

vi.mock("../composables/useResultsLoader", () => ({
  useResultsLoader: () => loaderState,
}));

vi.mock("../components/PartyCard/PartyCard.vue", () => ({
  default: {
    name: "PartyCard",
    props: ["party"],
    template: '<div class="party-card-stub">{{ party.name }}</div>',
  },
}));

vi.mock("../components/ConfidenceIndicator/ConfidenceIndicator.vue", () => ({
  default: {
    name: "ConfidenceIndicator",
    template: '<div class="confidence-indicator-stub" />',
  },
}));

vi.mock(
  "../components/ResultBreakdownEnhanced/ResultBreakdownEnhanced.vue",
  () => ({
    default: {
      name: "ResultBreakdownEnhanced",
      props: ["scores"],
      emits: ["compare"],
      template:
        '<div><div class="breakdown-count">{{ scores.length }}</div><button class="emit-compare" @click="$emit(\'compare\', scores)">compare</button></div>',
    },
  })
);

vi.mock("../components/PartyComparison/PartyComparison.vue", () => ({
  default: {
    name: "PartyComparison",
    props: ["parties", "show"],
    template:
      '<div class="comparison-stub" :data-show="String(show)" :data-count="parties.length" />',
  },
}));

const i18n = createTestI18n();

describe("Results view", () => {
  beforeEach(() => {
    routerPushMock.mockReset();
    writeTextMock.mockClear();
    quizStoreMock.encodeAnswersToUrl.mockClear();
    quizStoreMock.reset.mockClear();

    loaderState.loading.value = false;
    loaderState.error.value = undefined;
    loaderState.result.value = {
      primary: partyScores[0],
      alternatives: [partyScores[1], partyScores[2]],
      allScores: partyScores,
      confidence: "high",
    };

    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: writeTextMock,
      },
    });
  });

  it("renders loading state", () => {
    loaderState.loading.value = true;
    loaderState.result.value = undefined;

    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    expect(wrapper.find('[data-testid="results-loading"]').exists()).toBe(true);
  });

  it("renders error state and navigates to quiz", async () => {
    loaderState.result.value = undefined;
    loaderState.error.value = "Load failed";

    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain("Load failed");

    await wrapper
      .find('[data-testid="results-error"] [data-testid="results-go-to-quiz"]')
      .trigger("click");
    expect(routerPushMock).toHaveBeenCalledWith("/quiz");
  });

  it("renders primary and alternatives with other scores breakdown", () => {
    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    expect(wrapper.text()).toContain("Primary Party");
    expect(wrapper.text()).toContain("Alt One");
    expect(wrapper.text()).toContain("Alt Two");
    expect(wrapper.find(".breakdown-count").text()).toBe("1");
  });

  it("opens comparison modal when breakdown emits compare", async () => {
    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    await wrapper.find(".emit-compare").trigger("click");

    const comparison = wrapper.find(".comparison-stub");
    expect(comparison.attributes("data-show")).toBe("true");
    expect(comparison.attributes("data-count")).toBe("1");
  });

  it("retake button resets store and routes to quiz", async () => {
    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    await wrapper.find('[data-testid="results-retake"]').trigger("click");

    expect(quizStoreMock.reset).toHaveBeenCalledTimes(1);
    expect(routerPushMock).toHaveBeenCalledWith("/quiz");
  });

  it("copy button writes share text to clipboard", async () => {
    const wrapper = mount(Results, {
      global: { plugins: [i18n] },
    });

    await wrapper.find('[data-testid="results-share"]').trigger("click");
    await Promise.resolve();

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(quizStoreMock.encodeAnswersToUrl).toHaveBeenCalledTimes(1);
  });
});
