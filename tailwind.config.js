/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#C17A5A',
          light: '#D4967A',
          dark: '#A5624A',
        },
        sage: {
          DEFAULT: '#7D9B76',
          light: '#9BB594',
          dark: '#627A5C',
        },
        cream: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E8D4',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#DFC06E',
          dark: '#A88A38',
        },
        charcoal: {
          DEFAULT: '#3D3535',
          light: '#5C5050',
          dark: '#2A2424',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FDF6EC 0%, #F5E8D4 100%)',
      },
    },
  },
  plugins: [],
};
