import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import process from 'process';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/my-trading-app/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: false,
  },
});
