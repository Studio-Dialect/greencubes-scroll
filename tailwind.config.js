/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes:  {
        pingSm: {
          '0%': { transform: 'scale(0.7)', opacity: 1 },
          '100%': { transform: 'scale(1.2)', opacity: 0}
        }
      }, 
      animation: {
        'pingSm': 'pingSm 1s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};
