import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import react from '@vitejs/react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  /*
  server: {
    proxy: {
      // Whenever React requests something starting with '/api'
      // Vite forwards it to Python server auto
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }*/
})
