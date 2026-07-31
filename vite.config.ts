import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          apollo: ['@apollo/client', 'graphql'],
          motion: ['framer-motion'],
          charts: ['recharts'],
          router: ['react-router-dom'],
        },
      },
    },
  },
})
