/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          red: '#9B2335',
          green: '#1B4D3E',
          gold: '#D4AF37',
          ivory: '#FFFFF0',
          cream: '#FDF5E6',
          brown: '#8B4513',
          maroon: '#800000',
          turquoise: '#30D5C8',
          sapphire: '#082567',
          emerald: '#50C878'
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'mughal-pattern': "url('https://www.transparenttextures.com/patterns/arabesque.png')",
        'floral-pattern': "url('https://www.transparenttextures.com/patterns/flower-trail.png')",
        'geometric-pattern': "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')",
        'paisley-pattern': "url('https://www.transparenttextures.com/patterns/paisley.png')"
      },
      borderRadius: {
        'mughal': '2rem 0 2rem 0',
        'arch': '50% 50% 0 0'
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(212, 175, 55, 0.1)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')
  ],
};