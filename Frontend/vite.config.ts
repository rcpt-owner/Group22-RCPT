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
  preview: {
    host: '0.0.0.0',    // binds the preview server to all network interfaces
    port: 3000,
    allowedHosts: [
      'group22-rcpt.onrender.com' // add your Render domain here
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
  
})
