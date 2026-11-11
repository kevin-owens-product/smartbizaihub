/** @type {import('tailwindcss').Config} */
// 2026-11 family refresh: the palette and type of the refreshed productexec.co
// (cool neutrals, electric-blue accent, mint highlight, Inter Tight display).
export default {
  content: ['./index.html', './*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter Tight"', '"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: { DEFAULT: '#0b0d12', soft: '#1d222c' },
        muted: '#5a6272',
        paper: '#f5f6f8',
        line: '#e2e5eb',
        accent: { DEFAULT: '#2b4fd8', bright: '#4f7bff', soft: '#9db8ff' },
        mint: { DEFAULT: '#34d399', soft: '#86efc4', deep: '#047857' },
      },
    },
  },
  plugins: [],
};
