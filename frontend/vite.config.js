import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the API runs on :5000 - the proxy avoids any CORS setup.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // lets phones on the same Wi-Fi open http://<your-pc-ip>:5173
    proxy: {
      "/api": { target: "http://localhost:5001", changeOrigin: true },
    },
  },
});
