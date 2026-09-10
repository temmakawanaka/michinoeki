import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";
import "./visited.css";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");

if (apiBaseUrl) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      return nativeFetch(`${apiBaseUrl}${input}`, init);
    }
    return nativeFetch(input, init);
  };
}

createApp(App).mount("#app");
