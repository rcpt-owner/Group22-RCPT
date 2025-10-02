import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,    // binds to 0.0.0.0 so Docker can expose it
    port: 3000,    // dev server port
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
  
})