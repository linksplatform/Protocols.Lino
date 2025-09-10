import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Protocols.Lino/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000
  }
})