import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/raceSYNC/', // für GitHub Pages

  build: {
    outDir: 'dist', // wichtig für Electron
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // notwendig für korrektes Entry-Handling
      },
    },
  },
})
