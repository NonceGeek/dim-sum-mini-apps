module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "font-[NotoSansLisu]",
    "font-[SimHei]",
    "font-[CactusClassicalSerif]",
    "font-[NotoSansTC]",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
