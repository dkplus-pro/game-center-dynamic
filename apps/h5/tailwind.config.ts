import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS configuration for the H5 mobile app.
 *
 * Scans both app-level source files and shared component library
 * so that utility classes used in @game-center/components are
 * included in the final CSS bundle.
 */
export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/components/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;