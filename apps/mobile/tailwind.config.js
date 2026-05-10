/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#080b0a",
        panel: "#111615",
        panel2: "#18201d",
        line: "#26312d",
        neon: "#36f58a",
        muted: "#95a39b"
      }
    }
  },
  plugins: []
};
