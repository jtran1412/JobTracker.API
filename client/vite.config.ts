import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // React dev server runs on port 5173
    proxy: {
      '/api': {
        target: 'http://localhost:5195',
        changeOrigin: true,
        secure: false
      },
      '/MVC': {
        target: 'http://localhost:5195',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
