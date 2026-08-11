import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        id: '/',
        start_url: '/',
        lang: 'fr',
        dir: 'ltr',
        iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
        related_applications: [
          {
            platform: 'play',
            url: 'https://play.google.com/store/apps/details?id=com.smartstay.premium',
            id: 'com.smartstay.premium'
          }
        ],
        name: 'SmartStay Premium',
        short_name: 'SmartStay',
        description: 'Trouvez les meilleurs hôtels pour vos vacances.',
        theme_color: '#003B95',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['tabbed', 'standalone'],
        orientation: 'portrait',
        categories: ['travel', 'lifestyle', 'productivity'],
        prefer_related_applications: false,
        scope_extensions: [
          { origin: 'https://auth.smartstay-premium.vercel.app' }
        ],
        edge_side_panel: {
          preferred_width: 400
        },
        widgets: [
          {
            name: 'Recherche Rapide',
            description: 'Recherchez un voyage depuis votre écran d\'accueil',
            tag: 'smartstay-widget',
            template_url: '/',
            ms_ac_template: 'none',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
            screenshots: [{ src: '/widget-screenshot.png', sizes: '1080x720', type: 'image/png', label: 'Widget' }]
          }
        ],
        shortcuts: [
          {
            name: 'Recherche Premium',
            short_name: 'Recherche',
            description: 'Lancer une nouvelle recherche',
            url: '/',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ],
        note_taking: {
          new_note_url: '/?note=new'
        },
        launch_handler: {
          client_mode: ['navigate-existing', 'auto']
        },
        file_handlers: [
          {
            action: '/',
            accept: {
              'text/plain': ['.txt']
            }
          }
        ],
        protocol_handlers: [
          {
            protocol: 'web+smartstay',
            url: '/?url=%s'
          }
        ],
        share_target: {
          action: '/',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshot-wide.png',
            sizes: '1080x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Recherche'
          },
          {
            src: '/screenshot-narrow.png',
            sizes: '720x1080',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Résultats'
          }
        ]
      }
    })
  ]
})
