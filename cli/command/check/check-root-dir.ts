import { isDirectory, readdirSync } from "../../utils/fs.utils";
import { CheckCommand } from "../../cli";
import { check } from "../../utils/assert.utils";

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
            msg: "Project should have a 'labs' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes("labs") &&
            isDirectory(command.rootDir, "labs"),
    );
    check(
        "G_002",
        {
            msg: "Project should have a 'slides' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes("slides") &&
            isDirectory(command.rootDir, "slides"),
    );
}

function readRootDir(command: CheckCommand) {
    return readdirSync(command.rootDir);
}
