import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // react-virtualized is linked from the workspace root;
    // make sure it shares this app's copy of React
    dedupe: ["react", "react-dom"]
  },
  server: {
    cors: true
  }
});
