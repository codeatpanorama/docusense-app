import { fileURLToPath, URL } from 'node:url'
import resolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  ...(process.env.NODE_ENV === 'development'
    ? {
      define: {
        global: {},
      },
    }
    : {}),
  plugins: [vue(),resolve()],
  server: {
    host: true,
    port: 8000, // Docker Port
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
