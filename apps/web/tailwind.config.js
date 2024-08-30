const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{js,ts,jsx,tsx,mdx}'
    ),
    '../../packages/nexus/src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/nexus/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/base/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/common/**/*.{js,ts,jsx,tsx,mdx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-fast': 'spin 0.4s linear infinite',
      },
    },
  },
  plugins: [],
};
