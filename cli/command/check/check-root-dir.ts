import { CheckCommand } from "../../cli";
import { check } from "../../utils/assert.utils";
import fs from "node:fs";
import { isDirectory } from "../../utils/fs.utils";

export function checkRootDir(command: CheckCommand) {
    check(
        "G_001",
        {
            msg: `Project root dir (${command.rootDir}) does not exist.`,
            continueCheck: false,
        },
        () => isDirectory(command.rootDir),
    );
    check(
        "G_003",
        {
            msg: "Project should have a 'steps' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes("steps") &&
            isDirectory(command.rootDir, "steps"),
    );
    check(
        "G_002",
        {
            msg: "Project should have a 'docs' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes("docs") &&
            isDirectory(command.rootDir, "docs"),
    );
}

function readRootDir(command: CheckCommand) {
    return fs.readdirSync(command.rootDir);
}
