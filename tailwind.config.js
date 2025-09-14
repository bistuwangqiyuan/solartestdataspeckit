/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 工业风深色主题色彩
        background: '#0A0E27',
        foreground: '#E5E7EB',
        primary: {
          DEFAULT: '#00D4FF',
          hover: '#00A8CC',
          light: '#33DDFF',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        dark: {
          100: '#374151',
          200: '#1F2937',
          300: '#111827',
          400: '#0F172A',
        },
        muted: '#9CA3AF',
        border: '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00D4FF, 0 0 10px #00D4FF' },
          '100%': { boxShadow: '0 0 10px #00D4FF, 0 0 20px #00D4FF' },
        },
      },
      borderRadius: {
        'xl': '12px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}