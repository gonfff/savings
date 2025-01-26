import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        30: '120px',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'retro',
      'lofi',
      'pastel',
      'buisiness',
      'dracula',
      'lemonade',
      'coffee',
      'winter',
      'silk',
      'nord',
    ],
  },
};
