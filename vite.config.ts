import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves this project from /collagefab/, but local dev and preview
// stay at the root so the dev server URL is unchanged.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/collagefab/' : '/',
  plugins: [react()],
}));
