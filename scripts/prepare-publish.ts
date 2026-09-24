import { PackageJson } from 'type-fest';
import { buildPackageJson } from './utils/package-json.utils';
import packageJson from '../package.json';
import shelljs from 'shelljs';
import viteConfig from '../vite.config';

const DIST = viteConfig.build!.outDir!;

buildPackageJson(packageJson as PackageJson, DIST);

copyDocs();

function copyDocs() {
    shelljs.cp('-f', './README.md', './dist');
    shelljs.rm('-rf', './dist/docs');
    shelljs.cp('-rf', './docs', './dist/docs');

    // ADR-0000: publish docs/adr as a top-level dist/adr, consumed by
    // downstream tiers as web_modules/sfeir-school-theme/dist/adr. This is
    // also where sfeir-school-theme-migrate reads 0000-adopt-adrs.md and
    // 0001-comply-with-theme-adrs.md from, to seed a migrated project's
    // docs/adr/ (see ADR-0001, the V4 -> V5 structural migration).
    shelljs.rm('-rf', './dist/adr');
    shelljs.cp('-rf', './docs/adr', './dist/adr');
}
/*const shelljs = require('shelljs');
const fs = require('node:fs');

cleanupPackageJson();
prepareFeather();
copyDocs();
console.log('prepare-publish.js END');

function cleanupPackageJson() {
    shelljs.rm('-f', './dist/package.json');

    const packageJson = require('../package.json');

    // delete deps keys (because no deps after building it)
    delete packageJson.dependencies;
    delete packageJson.devDependencies;

    // delete scripts (because useless for published package)
    delete packageJson.scripts;

    fs.writeFileSync(
        './dist/package.json',
        JSON.stringify(packageJson, undefined, 2)
    );
}

function prepareFeather() {
    shelljs.cp('-rf', './node_modules/feather-icons', './dist/feather-icons');
    shelljs.rm('-rf', './dist/feather-icons/node_modules');
}

function copyDocs() {
    shelljs.cp('-f', './README.md', './dist');
    shelljs.rm('-rf', './dist/docs');
    shelljs.mkdir('-p', './dist/docs');
    shelljs.cp('-rf', './docs', './dist/docs');
}
*/
