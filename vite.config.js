import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import process from 'process';

// https://vite.dev/config/
export default defineConfig({
  base: '/my-trading-app/', // Add this line
  publicDir: 'public', // Ensure public directory is set
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: false,
  },
});
