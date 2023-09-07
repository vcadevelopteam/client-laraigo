import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
        port: 3000,
        https: false,
    },
    build: {
        outDir: "build",
    },
    resolve: {
        alias: [
            {
                find: "360dialog-connect-button",
                replacement: path.resolve(
                    __dirname,
                    "node_modules/360dialog-connect-button/dist/dialog-connect-button.esm.js"
                ),
            },
        ],
    },
});
