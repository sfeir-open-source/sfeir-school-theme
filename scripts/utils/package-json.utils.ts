import { PackageJson } from 'type-fest';
import fs from 'node:fs';
import path from 'node:path';

export function buildPackageJson(packageJson: PackageJson, dist: string) {
    const cleanedPackageJson = { ...packageJson };
    delete cleanedPackageJson.dependencies;
    delete cleanedPackageJson.devDependencies;
    delete cleanedPackageJson.overrides;
    delete cleanedPackageJson.private;
    delete cleanedPackageJson.scripts;
    fs.writeFileSync(
        path.join(dist, 'package.json'),
        JSON.stringify(
            {
                ...cleanedPackageJson,
                type: 'module',
                main: './sfeir-school-theme.js',
            },
            undefined,
            2
        )
    );
}
