import { defineConfig } from 'vite';
import react from '@vitejs/react-refresh'; // ya @vitejs/plugin-react
import { tanstackStart } from '@tanstack/start/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tanstackStart({
      deployment: {
        preset: 'vercel'
      },
      server: {
        entry: 'server'
      }
    })
  ]
});
