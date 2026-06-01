import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { coverageConfigDefaults } from 'vitest/config';
import path from 'path';
 
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      open: false,
      gzipSize: true,
    }),
  ],
 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
 
  build: {
    chunkSizeWarningLimit: 500, // KB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-firebase': ['firebase'],
          'vendor-charts': ['recharts'],
          'vendor-socket': ['socket.io-client'],
        },
      },
    },
  },
 
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        global: {
          lines: 75,
          functions: 75,
          branches: 70,
          statements: 75,
        },
      },
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/types/**',
        '**/assets/**',
        '**/pages/**',
        '**/layouts/**',
        '**/main.tsx',
        '**/App.tsx',
      ],
    },
  },
});