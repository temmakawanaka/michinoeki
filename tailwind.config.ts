import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211a",
        moss: "#436850",
        paper: "#f7f1e3",
        clay: "#c06b3e"
      }
    }
  },
  plugins: []
};

export default config;
