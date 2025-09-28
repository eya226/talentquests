import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use the automatic JSX runtime
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 3000,
  },
});