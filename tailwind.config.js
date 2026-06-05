/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F3E5AB',
          DEFAULT: '#D4AF37', // Metallic gold
          dark: '#AA7C11',
          premium: '#C5A880'  // Subdued gold/champagne
        },
        beige: {
          light: '#FAF8F5',
          DEFAULT: '#F4F1EA',
          dark: '#E2DCD0',
          sand: '#ECE5C8'
        },
        charcoal: {
          light: '#333333',
          DEFAULT: '#1A1A1A',
          dark: '#111111'
        },
        luxuryGray: {
          light: '#F9F9F9',
          DEFAULT: '#F2F2F2',
          dark: '#E0E0E0'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 10px 30px 0 rgba(197, 168, 128, 0.15)',
      }
    },
  },
  plugins: [],
}
