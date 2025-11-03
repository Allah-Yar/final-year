import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Environment variables configuration
  define: {
    // Make environment variables available to the client
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  
  // Server configuration
  server: {
    port: 5173,
    host: true,
    open: true, // Open browser automatically
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  
  // Environment variables
  envPrefix: 'VITE_',
})
