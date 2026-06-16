/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wc-gold': '#B8860B',
        'wc-dark': '#1a1a2e',
        'wc-blue': '#16213e',
        'wc-accent': '#0f3460',
        'upset-high': '#ef4444',
        'upset-medium': '#f59e0b',
        'upset-low': '#22c55e',
      },
    },
  },
  plugins: [],
}
