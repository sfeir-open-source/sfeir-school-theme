import { PROJECT_ROOT } from './scripts/utils/dir.utils';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(PROJECT_ROOT, 'src', 'main.ts'),
            name: 'sfeir-school-theme',
            fileName: 'sfeir-school-theme',
        },
        outDir: path.resolve(PROJECT_ROOT, 'dist'),
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css')
                        return 'sfeir-school-theme.css';
                    return assetInfo.name ?? 'vendor.css';
                },
            },
        },
    },
    plugins: [dts({ rollupTypes: true })],
});
