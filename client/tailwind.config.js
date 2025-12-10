/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0D3B66',
          secondary: '#F95738',
          gold: '#FFB703',
          bg: '#FAF5EE',
          surface: '#FFFFFF',
          muted: '#6F6F6F',
          border: '#E8E2D6',
        },
        success: '#4CAF50',
        warning: '#F59E0B',
        error: '#E53935',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['42px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-2': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'display-3': ['26px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'premium': '0 6px 20px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
        'premium-hover': '0 8px 30px rgba(0, 0, 0, 0.15)',
        'gold': '0 4px 20px rgba(255, 183, 3, 0.3)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
