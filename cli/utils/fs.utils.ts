import fs, { PathLike } from "node:fs";
import path from "node:path";

export function isDirectory(dir: string, file?: string): boolean {
    try {
        if (file == undefined) {
            return fs.statSync(dir).isDirectory();
        } else {
            return fs.statSync(path.resolve(dir, file)).isDirectory();
        }
    } catch {
        return false;
    }
}

export function readdirSync(pathLike: PathLike,
    options?:
        | {
            encoding: BufferEncoding | null;
            withFileTypes?: false | undefined;
            recursive?: boolean | undefined;
        }
        | BufferEncoding
        | null,
): string[] {
    return fs.readdirSync(pathLike, options).filter(file => !file.startsWith('.') && file !== 'Thumbs.db')
}