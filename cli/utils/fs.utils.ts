import fs from "node:fs";
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
