import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Specify the desired port for your React app
    proxy: {
      '/api': 'http://localhost:5195', // Proxy API requests to the backend
    },
  },
})
