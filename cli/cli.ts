import path from "node:path";

export type HelpCommand = { type: "help" };
export type VersionCommand = { type: "version" };
export type InitConfigCommand = { type: "init-config"; rootDir: string };
export type CheckCommand = { type: "check"; rootDir: string };

export type Command =
    | HelpCommand
    | VersionCommand
    | InitConfigCommand
    | CheckCommand;

export function parseArgs(args: string[], currentWorkingDir: string): Command {
    if (args.includes("help")) {
        return { type: "help" };
    }
    if (args.includes("version")) {
        return { type: "version" };
    }
    if (args.includes("init-config")) {
        return {
            type: "init-config",
            rootDir: getRootDirOrDefault(args, currentWorkingDir),
        };
    }
    if (args.includes("check")) {
        return {
            type: "check",
            rootDir: getRootDirOrDefault(args, currentWorkingDir),
        };
    }
    return { type: "help" };
}

function getRootDirOrDefault(
    args: string[],
    currentWorkingDir: string,
): string {
    const fromArgs = args.find((arg) => arg.startsWith("--rootDir="));
    if (fromArgs == undefined) {
        return currentWorkingDir;
    }
    return path.resolve(fromArgs.replace("--rootDir=", ""));
}
