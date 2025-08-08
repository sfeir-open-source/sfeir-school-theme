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
    shelljs.mkdir('-p', './dist/docs');
    shelljs.cp('-rf', './docs', './dist/docs');
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
