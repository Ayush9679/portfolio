import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    // Dev server: proxy API calls to local FastAPI to avoid CORS issues in dev
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
        '/admin/login': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Preview server (used after `npm run build`)
    preview: {
      port: 4173,
    },

    build: {
      // Increase chunk size warning threshold (video is large, assets may be too)
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual code splitting: vendor bundle separate from app code
          manualChunks: (id: string) => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/framer-motion')) {
              return 'motion-vendor';
            }
            if (id.includes('node_modules/react-router')) {
              return 'router-vendor';
            }
          },
        },
      },
    },
  };
});