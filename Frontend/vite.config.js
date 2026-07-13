import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'],
            manifest: {
                name: 'ChairSync - Barber Management',
                short_name: 'ChairSync',
                description: 'Real-time chair and queue management for barbershops',
                theme_color: '#967249',
                background_color: '#f0eada',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                // Cache the app shell; API calls are left to network (queue data must stay live)
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                navigateFallback: 'index.html',
                navigateFallbackDenylist: [/^\/api/],
            },
        }),
    ],
})
