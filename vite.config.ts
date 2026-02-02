import vue from "@vitejs/plugin-vue";
import { FontaineTransform } from "fontaine";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      minify: true,
      manifest: {
        name: "Elekti - Find Your Political Match",
        short_name: "Elekti",
        description:
          "Match your vote to South Africa. Answer 55 quick questions on coalitions, load-shedding, jobs, safety, and housing. See which parties line up with your priorities.",
        theme_color: "#007a4d",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2,woff,png,svg,jpg,jpeg,gif}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
    FontaineTransform.vite({
      fallbacks: [
        "Inter",
        "Inter Variable",
        "Inter Tight Variable",
        "Helvetica Neue",
        "Arial",
        "Roboto",
        "Segoe UI",
        "system-ui",
      ],
      resolvePath: (id) => (id.startsWith("/") ? "." + id : id),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  cacheDir: ".vite",
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/vue")) {
            return "vue";
          }
          if (id.includes("node_modules/vue-router")) {
            return "vue-router";
          }
          if (id.includes("node_modules/pinia")) {
            return "pinia";
          }
          if (id.includes("node_modules/vue-i18n")) {
            return "vue-i18n";
          }
          if (id.includes("node_modules/zod")) {
            return "zod";
          }
          if (id.includes("node_modules/lucide-vue-next")) {
            return "lucide-icons";
          }
          if (id.includes("/data/") && id.endsWith(".json")) {
            return "data";
          }
          if (id.includes("/translations/") && id.endsWith(".json")) {
            return "i18n-data";
          }
        },
      },
      onwarn(warning, warn) {
        if (
          warning.code === "IMPORT_IS_UNDEFINED" &&
          warning.message.includes("vue-i18n")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
