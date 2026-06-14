import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

/**
 * Modern.js configuration for the H5 mobile app.
 *
 * - File-based routing under src/routes/
 * - Tailwind CSS for utility-first styling
 * - Dev proxy: /api → backend on port 3000
 * - Runs on port 8081
 */
export default defineConfig({
  runtime: {
    router: true,
  },
  plugins: [appTools(), tailwindcssPlugin()],
  server: {
    port: 8081,
  },
  dev: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});