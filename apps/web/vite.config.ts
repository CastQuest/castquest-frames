import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for CastQuest V3
// Note: Next.js is the primary build tool, but this config provides
// additional tooling support and faster HMR for component development

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@app': path.resolve(__dirname, './app'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize for modern browsers
    target: 'es2020',
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'next-vendor': ['next'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
