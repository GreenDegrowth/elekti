import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    name: "app/files-to-ignore",
    ignores: [
      "**/dist/**",
      "**/dist-ssr/**",
      "**/dev-dist/**",
      "**/coverage/**",
      "**/.vite/**",
      "**/.vscode/**",
      "**/node_modules/**",
      "package-lock.json",
      "**/*.json",
    ],
  },
  ...defineConfigWithVueTs(
    {
      name: "app/files-to-lint",
      files: ["**/*.{ts,mts,tsx,vue}"],
    },

    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    pluginUnicorn.configs.recommended,
    skipFormatting,
    {
      rules: {
        "vue/multi-word-component-names": "off",
        "unicorn/filename-case": "off",
        "unicorn/prevent-abbreviations": "off",
      },
    }
  ),
];
