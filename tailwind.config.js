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
        "header-color": "#ede9f3",
        "link-color": "#f4c33d",
        "link-hover-color": "#bd3df4",
        "button-bg": "#1d4ed8",
        "button-hover-bg": "#1e40af",
      },
      spacing: {
        32: "8rem",
        20: "5rem",
      },
      backgroundImage: {
        "gradient-bg": "linear-gradient(180deg, #232029, #231e2d)",
      },
      dropShadow: {
        "custom-white": "0 0 8px rgba(255 , 255, 255, 0)", // 완전히 불투명한 하얀색 그림자
      },
    },
  },
  plugins: [],
};