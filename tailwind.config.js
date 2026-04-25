/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          bg: '#0a0a0a',
          surface: '#111111',
          chrome: '#c8d8f0',
          bio: '#1a6fff',
          muted: 'rgba(200,210,220,0.6)',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
