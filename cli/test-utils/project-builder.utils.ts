import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type FileContent = string;
export type DirStruct = { [k: string]: DirStruct | FileContent };

export function isFileContent(x: DirStruct | FileContent): x is FileContent {
    return typeof x === "string";
}
// function isDirStruct(x: DirStruct | FileContent): x is DirStruct {
//     return typeof x === 'object';
// }

export function buildProject(project: DirStruct): string {
    const rootDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "sfeir-school-theme__cli_check__"),
    );
    buildDirectory(rootDir, { project });
    console.log("PROJECT BUILT", rootDir);
    return `${rootDir}/project`;
}

function buildDirectory(rootDir: string, dir: DirStruct) {
    for (const [name, struct] of Object.entries(dir)) {
        if (isFileContent(struct)) {
            fs.writeFileSync(`${rootDir}/${name}`, struct, "utf-8");
        } else {
            const dir = `${rootDir}/${name}`;
            fs.mkdirSync(dir);
            buildDirectory(dir, struct);
        }
    }
}
