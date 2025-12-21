import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        rose: "#E8B4B8",
        cream: "#FFF8F0",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"], // Royal headings
        sans: ["Josefin Sans", "sans-serif"], // Elegant paragraph
      },
    },
  },
} satisfies Config;
