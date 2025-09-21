import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from any IP address
    port: 5173,      // Default port (you can change this if needed)
    strictPort: false, // Allow fallback to other ports if 5173 is busy
  },
  preview: {
    host: '0.0.0.0', // Also apply to preview mode
    port: 4173,
    strictPort: false,
  }
})
