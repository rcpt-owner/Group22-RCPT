import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        port: 3000,
        // You can keep allowedHosts here for local dev if needed
    },
    preview: {
        allowedHosts: ['group22-rcpt.onrender.com']
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})
