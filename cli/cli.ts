import path from "node:path";

export type CheckCommand = { type: "check"; rootDir: string };
export type HelpCommand = { type: "help" };
export type InfoCommand = { type: "info"; rootDir: string };
export type InitConfigCommand = { type: "init-config"; rootDir: string };
export type VersionCommand = { type: "version" };

export type Command =
    | CheckCommand
    | HelpCommand
    | InfoCommand
    | InitConfigCommand
    | VersionCommand;

export function parseArgs(args: string[], currentWorkingDir: string): Command {
    if (args.includes("help")) {
        return { type: "help" };
    }
    if (args.includes("version")) {
        return { type: "version" };
    }
    if (args.includes("info")) {
        return {
            type: "info",
            rootDir: getRootDirOrDefault(args, currentWorkingDir),
        };
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
