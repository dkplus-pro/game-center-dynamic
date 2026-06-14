import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

export default defineConfig({
  runtime: { router: true },
  plugins: [appTools(), tailwindcssPlugin()],
  server: { port: 8080 },
  dev: {
    proxy: { '/api': 'http://localhost:3000' },
  },
});