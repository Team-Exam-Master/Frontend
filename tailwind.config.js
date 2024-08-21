/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind CSS를 적용할 파일의 경로
  ],
  theme: {
    extend: {
      colors: {
        "background-start": "#232029",
        "background-end": "#231e2d",
        "text-color": "#ddd8e4",
      },
      spacing: {
        32: "8rem",
        20: "5rem",
      },
      backgroundImage: {
        "gradient-bg": "linear-gradient(180deg, #232029, #231e2d)",
      },
      dropShadow: {
        "custom-white": "0 0 8px rgba(43, 40, 47, 1)",
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        exit: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(50px)" },
        },
      },
      animation: {
        "fade-in": "enter 300ms ease-in",
        "fade-out": "exit 300ms ease-in",
      },
    },
  },
  plugins: [],
};
