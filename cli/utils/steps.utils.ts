import fs from "node:fs";
import { getWorkspaceStepsPackageJsonPath } from "./path.utils";
import { ConfigJson } from "./config.utils";

export function isStepDirectoryExists(stepDirPath: string) {
    return fs.existsSync(stepDirPath);
}

export interface PackageJson {
    workspaces?: string[];
    steps?: string[];
    scripts?: Record<string, string>;
}

export function getWorkspaceStepsPackageJson(rootDir: string): PackageJson {
    return JSON.parse(
        fs.readFileSync(getWorkspaceStepsPackageJsonPath(rootDir), "utf-8"),
    );
}

export function getLabsCommands(
    rootDir: string,
    { withSolution = false }: { withSolution?: boolean } = {},
): string[] {
    const packageJson = getWorkspaceStepsPackageJson(rootDir);
    const allCommands = packageJson.workspaces ?? packageJson.steps ?? [];
    if (withSolution) {
        return allCommands;
    } else {
        return allCommands.filter((labCommand) =>
            !labCommand.includes("-solution")
        );
    }
}

export function isLabCommandExists(rootDir: string, commandName: string) {
    return getLabsCommands(rootDir).includes(commandName);
}

export function getLabCommandTarget(labCommandRow: string, config: ConfigJson) {
    return labCommandRow.split(config.stepCommandPrefix)[1].trim();
}
