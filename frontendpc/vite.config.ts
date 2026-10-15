import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom", "react-router-dom"],
					ui: [
						"@radix-ui/react-checkbox",
						"@radix-ui/react-dropdown-menu",
						"@radix-ui/react-label",
						"@radix-ui/react-select",
						"@radix-ui/react-separator",
						"@radix-ui/react-slot",
						"@radix-ui/react-tabs",
						"lucide-react",
					],
					charts: ["recharts", "leaflet", "react-leaflet"],
					pdf: ["@react-pdf/renderer"],
					utils: ["zod", "react-hook-form", "xlsx", "js-cookie"],
				},
			},
		},
	},
});
