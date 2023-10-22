import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 1003,
    open: false,
    proxy: {
      '/file': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 允许跨域
        rewrite: path => path.replace('/file/', '/'),
      },
    },
  }
})
