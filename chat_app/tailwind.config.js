/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#1476ff",
        'secondary': "#f3f5ff",
        'light': "#f9faff",
      },
    },
  },
  plugins: [],
}

