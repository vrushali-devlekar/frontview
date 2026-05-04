import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    target: 'esnext',
    minify: 'oxc',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react'
          }
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'vendor-ui'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
})
