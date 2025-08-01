import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/main.js'),
            name: 'sfeir-school-theme',
            fileName: 'sfeir-school-theme',
        },
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css')
                        return 'sfeir-school-theme.css';
                    return assetInfo.name;
                },
            },
        },
    },
});
