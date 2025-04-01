/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', // Add extra-small screen breakpoint
      },
      colors: {
        'coffee-darker': '#362517',
        'coffee-dark': '#59331d',
        'coffee-medium': '#a57861',
        'coffee-light': '#e4d4cf',
        'coffee-bg': '#f4ece8',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        'coffee': '0 4px 14px rgba(89, 51, 29, 0.1), 0 2px 6px rgba(89, 51, 29, 0.08)',
        'coffee-hover': '0 10px 25px rgba(89, 51, 29, 0.18), 0 8px 10px rgba(89, 51, 29, 0.15)',
        'glow': '0 0 15px rgba(192, 159, 128, 0.7)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(89, 51, 29, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'coffee-pattern': "url('/images/coffee-pattern.png')",
        'coffee-texture': "url('/images/coffee-texture.svg')",
        'coffee-dark-texture': "url('/images/coffee-dark-texture.svg')",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
