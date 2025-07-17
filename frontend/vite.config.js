import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// Get __dirname equivalent in ESM

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {

  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:5001',
        target: 'https://task-manager-t993.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'production' ? 'production' : 'development'
    ),
  },
}))
