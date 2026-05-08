import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18211f",
        moss: "#315345",
        clay: "#9c5f3e",
        field: "#f6f4ee",
        line: "#dfded7"
      },
      boxShadow: {
        soft: "0 14px 34px rgba(24, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
