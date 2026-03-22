module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1a1a2e',
          accent: '#e94560',
          surface: '#16213e',
          muted: '#0f3460',
        },
      },
    },
  },
};
