/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 30%, 8%)',
        accent: 'hsl(320, 90%, 50%)',
        primary: 'hsl(210, 90%, 50%)',
        surface: 'hsl(210, 20%, 12%)',
        textPrimary: 'hsl(210, 10%, 90%)',
        textSecondary: 'hsl(210, 10%, 60%)',
        border: 'hsl(210, 20%, 20%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(210, 15%, 25%, 0.12)',
        'hover': '0 12px 32px hsla(210, 15%, 25%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}