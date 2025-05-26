import path from "node:path";

export function docsPath(rootDir: string) {
    return path.resolve(rootDir, "docs");
}

export function docsMarkdownPath(rootDir: string) {
    return path.resolve(docsPath(rootDir), "markdown");
}

export function slidePath(rootDir: string, slideFile: string) {
    return path.resolve(docsMarkdownPath(rootDir), slideFile);
}

export function docsFilePath(rootDir: string, assetFile: string) {
    return path.resolve(docsPath(rootDir), assetFile);
}

export function docsImagesPath(rootDir: string) {
    return path.resolve(docsPath(rootDir), "assets", "images");
}

export function docsImagePath(rootDir: string, filePath: string) {
    return path.resolve(docsImagesPath(rootDir), filePath);
}

export function stepsPath(rootDir: string) {
    return path.resolve(rootDir, "steps");
}

export function getWorkspaceStepsPackageJsonPath(rootDir: string) {
    return path.resolve(stepsPath(rootDir), "package.json");
}
