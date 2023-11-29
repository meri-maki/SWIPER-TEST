import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import basicSsl from "@vitejs/plugin-basic-ssl"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl()],
	server: {
		proxy: {
			// with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
			"/api": {
				target: "http://localhost:8008",
				changeOrigin: false,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
})
