import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL, // ✅ Your backend URL
        changeOrigin: true, // ✅ Avoid CORS issues
        secure: false, // ✅ Needed only if using HTTPS in local dev
        rewrite: (path) => path.replace(/^\/api/, ""), // ✅ Removes `/api` prefix before sending to backend
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
