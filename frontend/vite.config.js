import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('[PROXY ERROR]', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[PROXY =>]', req.method, req.url, '-> http://127.0.0.1:3003' + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[PROXY <=]', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
