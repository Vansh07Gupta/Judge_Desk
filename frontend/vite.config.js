import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    'process.env': {}
  },
  resolve: {
    alias: {
      stream: 'readable-stream',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      process: 'process/browser',
      util: 'util'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: ["simple-peer"]
  }
})
