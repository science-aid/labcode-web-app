import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ["labcode-web-app.com"],
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://www.example.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
                  proxy.on('proxyRes', (proxyRes, _req, _res) => {
                    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                  });
                }
      }
    }
  }
});