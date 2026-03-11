import { createPinia } from "pinia";
import { createApp } from "vue";

import "@fontsource-variable/inter";
import App from "./App.vue";
import { i18n } from "./i18n/i18n";
import router from "./router";
import "./styles/index.css";

const app = createApp(App);

app.config.errorHandler = (err, _vm, info) => {
  if (import.meta.env.DEV) {
    console.error(`[Vue Error] ${info}:`, err);
  }
};

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(import.meta.env.VITE_SW_URL || "/sw.js", {
    scope: "/",
  });
}
