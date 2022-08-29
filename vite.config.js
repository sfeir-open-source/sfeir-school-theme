import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "sfeir-theme",
      fileName: "sfeir-theme",
    },
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") return "sfeir-theme.css";
          return assetInfo.name;
        },
      },
    },
  },
});
