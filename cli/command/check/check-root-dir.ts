import fs from "node:fs";
import { CheckCommand } from "../../cli";
import { check } from "../../utils/assert.utils";
import { isDirectory } from "../../utils/fs.utils";

export function checkRootDir(command: CheckCommand) {
    check(
        {
            msg: `Project root dir (${command.rootDir}) does not exist.`,
            continueCheck: false,
        },
        () => isDirectory(command.rootDir),
    );
    check(
        {
            msg: "Project should have a 'steps' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes("steps") &&
            isDirectory(command.rootDir, "steps"),
    );
    check(
        { msg: "Project should have a 'docs' directory", continueCheck: false },
        () =>
            readRootDir(command).includes("docs") &&
            isDirectory(command.rootDir, "docs"),
    );
}

function readRootDir(command: CheckCommand) {
    return fs.readdirSync(command.rootDir);
}
