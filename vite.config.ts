import preserveDirectives from "rollup-preserve-directives";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDevServerConfig } from "react-lib-tools/scripts/dev-server.js";
import { defineConfig, type UserConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import { dependencies, peerDependencies } from "./package.json";

const __dirname = dirname(fileURLToPath(import.meta.url));

const externalPackages = [
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies)
];

const libraryConfig: UserConfig = {
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "react-virtualized",
      fileName: "react-virtualized",
      formats: ["cjs", "es"]
    },
    // Consumers minify their own bundles; keeping names readable helps debugging (e.g. component names in React DevTools)
    minify: false,
    rollupOptions: {
      // Also externalize deep imports (e.g. "dom-helpers/scrollbarSize", "react/jsx-runtime")
      external: (id) =>
        externalPackages.some(
          (name) => id === name || id.startsWith(`${name}/`)
        )
    },
    sourcemap: true
  },
  plugins: [
    react(),
    dts({
      exclude: ["**/*.test.ts", "**/*.test.tsx", "lib/utils/test"],
      include: ["lib"],
      rollupTypes: true
    }),
    preserveDirectives(),
    viteStaticCopy({
      targets: [{ src: "lib/styles.css", dest: "." }]
    })
  ],
  publicDir: false
};

const websiteConfig: UserConfig = {
  base: "/",
  build: {
    minify: "terser",
    outDir: "docs",
    sourcemap: true,
    terserOptions: {
      format: {
        comments: false
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    visualizer({
      emitFile: true,
      filename: "stats.html"
    })
  ],
  resolve: {
    alias: {
      "react-virtualized": resolve(__dirname, "lib")
    }
  }
};

// Allow iPhone to connect to the DEV site using a local IP
if (process.env.NODE_ENV === "development") {
  // The port is configured in package.json ("react-lib-tools": { "devServerPort" }), which scripts like compile:search-index also read
  websiteConfig.server = {
    ...getDevServerConfig(),
    host: true
  };
}

let config: UserConfig = {};
switch (process.env.TARGET) {
  case "lib": {
    config = libraryConfig;
    break;
  }
  default: {
    config = websiteConfig;
    break;
  }
}

// https://vite.dev/config/
export default defineConfig(config);
