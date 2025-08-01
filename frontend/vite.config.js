import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const apiUrl = isProduction 
    ? (process.env.VITE_API_URL_PROD || 'https://glance-store.onrender.com')
    : (process.env.VITE_API_URL || 'http://localhost:5000');
  
  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },
    plugins: [vue()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    },
    define: {
      __VUE_PROD_DEVTOOLS__: false
    }
  };
});
