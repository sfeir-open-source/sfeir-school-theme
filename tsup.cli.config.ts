import { defineConfig } from "tsup";

export default defineConfig({
    tsconfig: "tsconfig.cli.json",
    entry: {
        "sfeir-school-theme-cli": "cli/main.ts",
    },
    splitting: false,
    sourcemap: false,
    format: "esm",
    clean: false,
    dts: false,
    bundle: true,
    noExternal: [],
    outExtension() {
        return {
            js: `.mjs`,
        };
    },
});
