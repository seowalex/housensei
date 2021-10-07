import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'dashesOnly',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
