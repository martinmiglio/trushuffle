const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      theme: {
        50: "#E5FBEC",
        100: "#CAF7DA",
        200: "#9AEFB8",
        300: "#65E792",
        400: "#34DF70",
        500: "#1DB954",
        600: "#179644",
        700: "#116E32",
        800: "#0C4B22",
        900: "#062310",
        950: "#031208",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // extend animate bounce with a 200 and 400ms delay
      animation: {
        bounce: "bounce 1s ease-in-out infinite",
        bounce200: "bounce 1s ease-in-out 200ms infinite",
        bounce400: "bounce 1s ease-in-out 400ms infinite",
      },
    },
  },
  plugins: [],
};
export default config;
