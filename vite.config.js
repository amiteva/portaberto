import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import'],
        additionalData: `
          @import "@/assets/styles/variables";
          @import "@/assets/styles/mixins";
        `
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.spec.js'],
    exclude: ['node_modules/**', 'dist/**', 'src-example/**', 'tests/e2e/**'],
    setupFiles: ['./tests/unit/setup.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['dist/**', 'src-example/**', 'tests/**']
    }
  }
})
