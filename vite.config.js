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
        related_applications: [],
        name: 'SmartStay Premium',
        short_name: 'SmartStay',
        description: 'Trouvez les meilleurs hôtels pour vos vacances.',
        theme_color: '#003B95',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'tabbed', 'standalone'],
        orientation: 'portrait',
        categories: ['travel', 'lifestyle', 'productivity'],
        prefer_related_applications: false,
        edge_side_panel: {
          preferred_width: 400
        },
        widgets: [
          {
            name: 'Recherche Rapide',
            description: 'Recherchez un voyage depuis votre écran d\'accueil',
            tag: 'smartstay-widget',
            template_url: '/',
            ms_ac_template: 'none'
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
            src: 'https://cdn-icons-png.flaticon.com/512/3168/3168688.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'https://smartstay-premium.vercel.app/screenshot-wide.png',
            sizes: '1080x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Recherche de voyages Premium'
          },
          {
            src: 'https://smartstay-premium.vercel.app/screenshot-narrow.png',
            sizes: '720x1080',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Résultats SmartStay'
          }
        ]
      }
    })
  ]
})
