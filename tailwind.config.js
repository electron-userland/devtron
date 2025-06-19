/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui'],
      'space-mono': ['Space Mono', 'ui-sans-serif', 'system-ui'],
      roboto: ['Roboto', 'ui-sans-serif', 'system-ui'],
    },
    extend: {},
  },
  plugins: [],
};
