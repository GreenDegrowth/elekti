import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LanguageSelector from "./LanguageSelector.vue";

const { localeRef, setLangMock, loadAFTranslationsMock } = vi.hoisted(() => ({
  localeRef: { value: "en" },
  setLangMock: vi.fn(),
  loadAFTranslationsMock: vi.fn().mockResolvedValue(),
}));

vi.mock("lucide-vue-next", () => ({
  ChevronDown: { template: "<span />" },
  Globe: { template: "<span />" },
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    locale: localeRef,
    t: (key: string) => {
      const labels: Record<string, string> = {
        "languages.en": "English",
        "languages.af": "Afrikaans",
        "languages.change": "Change language",
      };
      return labels[key] ?? key;
    },
  }),
}));

vi.mock("../../stores/uiStore", () => ({
  useUiStore: () => ({
    setLang: setLangMock,
  }),
}));

vi.mock("../../i18n/i18n", () => ({
  availableLocales: [
    { code: "en", name: "English" },
    { code: "af", name: "Afrikaans" },
  ],
  loadAFTranslations: loadAFTranslationsMock,
}));

describe("LanguageSelector", () => {
  beforeEach(() => {
    localeRef.value = "en";
    setLangMock.mockReset();
    loadAFTranslationsMock.mockReset();
    loadAFTranslationsMock.mockResolvedValue();
  });

  it("renders current language name on the button", () => {
    const wrapper = mount(LanguageSelector);
    expect(wrapper.find('[data-testid="language-toggle"]').text()).toContain(
      "English"
    );
  });

  it("opens dropdown and renders locale options sorted by name", async () => {
    const wrapper = mount(LanguageSelector);

    await wrapper.find('[data-testid="language-toggle"]').trigger("click");

    const options = wrapper.findAll('[data-testid="language-option"]');
    expect(options).toHaveLength(2);
    expect(options[0].text()).toBe("Afrikaans");
    expect(options[1].text()).toBe("English");
  });

  it("selecting Afrikaans loads translations and updates store", async () => {
    const wrapper = mount(LanguageSelector);
    await wrapper.find('[data-testid="language-toggle"]').trigger("click");

    await wrapper
      .findAll('[data-testid="language-option"]')[0]
      .trigger("click");

    expect(loadAFTranslationsMock).toHaveBeenCalledTimes(1);
    expect(setLangMock).toHaveBeenCalledWith("af");
    expect(wrapper.find('[data-testid="language-dropdown"]').exists()).toBe(
      false
    );
  });

  it("selecting English skips Afrikaans lazy-load", async () => {
    const wrapper = mount(LanguageSelector);
    await wrapper.find('[data-testid="language-toggle"]').trigger("click");

    await wrapper
      .findAll('[data-testid="language-option"]')[1]
      .trigger("click");

    expect(setLangMock).toHaveBeenCalledWith("en");
    expect(loadAFTranslationsMock).not.toHaveBeenCalled();
  });

  it("closes the dropdown on Escape", async () => {
    const wrapper = mount(LanguageSelector);

    const button = wrapper.find('[data-testid="language-toggle"]');
    await button.trigger("click");
    expect(wrapper.find('[data-testid="language-dropdown"]').exists()).toBe(
      true
    );

    await button.trigger("keydown.escape");
    expect(wrapper.find('[data-testid="language-dropdown"]').exists()).toBe(
      false
    );
  });
});
