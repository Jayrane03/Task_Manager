import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  build: {
    outDir: 'dist',
  },
  
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:5001', // Uncomment for local development
        target: 'https://task-manager-t993.onrender.com', // Backend server URL for production
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Move this to the root configuration level
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  },
}));
