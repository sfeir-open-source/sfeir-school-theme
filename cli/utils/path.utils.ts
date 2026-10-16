import path from 'node:path';

export function slidesPath(rootDir: string) {
    return path.resolve(rootDir, 'slides');
}

export function slidesMarkdownPath(rootDir: string) {
    return path.resolve(slidesPath(rootDir), 'markdown');
}

export function slidePath(rootDir: string, slideFile: string) {
    return path.resolve(slidesMarkdownPath(rootDir), slideFile);
}

export function slidesFilePath(rootDir: string, assetFile: string) {
    return path.resolve(slidesPath(rootDir), assetFile);
}

export function slidesAssetsPath(rootDir: string) {
    return path.resolve(slidesPath(rootDir), 'assets');
}

export function slidesAssetPath(rootDir: string, filePath: string) {
    return path.resolve(slidesAssetsPath(rootDir), filePath);
}

export function slidesImagesPath(rootDir: string) {
    return slidesAssetPath(rootDir, 'images');
}

export function slidesImagePath(rootDir: string, filePath: string) {
    return path.resolve(slidesImagesPath(rootDir), filePath);
}

export function labsPath(rootDir: string) {
    return path.resolve(rootDir, 'labs');
}

export function labsDirPackageJsonPath(rootDir: string) {
    return path.resolve(labsPath(rootDir), 'package.json');
}

export function labsDirLabsJsonPath(rootDir: string) {
    return path.resolve(labsPath(rootDir), 'labs.json');
}

export function projectConfigPath(rootDir: string) {
    return path.resolve(rootDir, '.sfeir-theme-config.json');
}

export function labPackageJsonPath(rootDir: string, lab: string) {
    return path.resolve(labsPath(rootDir), lab, 'package.json');
}

export function labReadmePath(rootDir: string, lab: string) {
    return path.resolve(labsPath(rootDir), lab, 'README.md');
}

export function labNoSolutionPath(rootDir: string, lab: string) {
    return path.resolve(labsPath(rootDir), lab, '.nosolution');
}
