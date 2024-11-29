import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 1025,
    hmr: true,
    proxy: {
      '/api': {
        // target: 'http://47.121.122.190:7090',
        target: 'http://localhost:7090',
        changeOrigin: true,
        pathRewrite: {
          '^api': '/api'
        }
      }
    }
  }
})
