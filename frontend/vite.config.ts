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
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/socket.io-client')) {
            return 'vendor-socket';
          }
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