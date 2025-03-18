import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const env = loadEnv('development', process.cwd(), '');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [env.ALLOWED_HOST],
    port: 5173,
    host: true,
    proxy: {
      '/log_server_api': {
        target: 'http://log_server:8000',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/log_server_api/, ''),
        configure: (proxy, _options) => {
                  proxy.on('proxyRes', (proxyRes, _req, _res) => {
                    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                  });
                }
      }
    }
  }
});