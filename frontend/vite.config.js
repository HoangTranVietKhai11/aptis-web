import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-icon.svg'],
      manifest: {
        name: 'APTIS ESOL Platform',
        short_name: 'APTIS',
        description: 'Nền tảng luyện thi APTIS chuyên nghiệp với AI',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
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
