import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    port: 8090,
    open: true,
    cors: true,
    proxy: {
      '/api/v1': {
        	target: 'http://localhost:5173',
        	changeOrigin: true,
        	// changeOrigin: Ensures the Host header is changed to match the target server
		}
    }
  }
});
