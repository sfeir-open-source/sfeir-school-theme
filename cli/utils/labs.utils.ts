import fs from "node:fs";
import {
    labPackageJsonPath,
    labReadmePath,
    labsDirLabsJsonPath,
    labsDirPackageJsonPath,
    labsPath,
} from "./path.utils";
import { ConfigJson } from "./config.utils";
import { isDirectory } from "./fs.utils";
import { isNotDefined } from "./fp.utils";

export function isStepDirectoryExists(stepDirPath: string) {
    return fs.existsSync(stepDirPath);
}

export interface LabsJson {
    kind: "labs.json";
    labs: string[];
}

export interface PackageJson extends Partial<Omit<LabsJson, "kind">> {
    kind: "package.json";
    name: string;
    workspaces?: string[];
    scripts?: Record<string, string>;
}

export function getWorkspaceStepsPackageJson(
    rootDir: string,
): PackageJson | LabsJson | null {
    const packageJson = labsDirPackageJsonPath(rootDir);
    const labsJson = labsDirLabsJsonPath(rootDir);
    if (fs.existsSync(packageJson)) {
        const raw = JSON.parse(fs.readFileSync(packageJson, "utf-8"));
        return { ...raw, kind: "package.json" };
    } else if (fs.existsSync(labsJson)) {
        const raw = JSON.parse(fs.readFileSync(labsJson, "utf-8"));
        return { ...raw, kind: "labs.json" };
    } else {
        return null;
    }
}

function extractLabsListFromPackageJson(
    packageJson: PackageJson | LabsJson | null,
): string[] {
    if (isNotDefined(packageJson)) {
        return [];
    }
    if (packageJson.kind === "package.json") {
        return packageJson.workspaces ?? packageJson.labs ?? [];
    }
    if (packageJson.kind === "labs.json") {
        return packageJson.labs ?? [];
    }
    return [];
}

export function getAllLabsFromWorkspace(
    rootDir: string,
    { withSolution = true }: { withSolution?: boolean } = {},
): string[] {
    const packageJson = getWorkspaceStepsPackageJson(rootDir);
    const allCommands = extractLabsListFromPackageJson(packageJson);
    if (withSolution) {
        return allCommands;
    } else {
        return allCommands.filter((labCommand) =>
            !labCommand.includes("-solution")
        );
    }
}

export function getLabsCommands(
    rootDir: string,
    { withSolution = false }: { withSolution?: boolean } = {},
): string[] {
    return getAllLabsFromWorkspace(rootDir, { withSolution });
}

export function isLabCommandExists(rootDir: string, commandName: string) {
    return getLabsCommands(rootDir).includes(commandName);
}

export function getLabCommandTarget(labCommandRow: string, config: ConfigJson) {
    return labCommandRow.split(config.stepCommandPrefix)[1].trim();
}

export function getAllLabsFromFs(rootDir: string, config: ConfigJson) {
    return fs.readdirSync(labsPath(rootDir), { encoding: "utf-8" })
        .filter((filePath) => !config.ignoreStepsDirectories.includes(filePath))
        .filter(
            (filePath) => isDirectory(labsPath(rootDir), filePath),
        );
}

export function getAllLabScripts(rootDir: string): string[] {
    const packageJson = getWorkspaceStepsPackageJson(rootDir);
    if (packageJson?.kind === "package.json") {
        return Object.keys(packageJson.scripts ?? {});
    } else {
        return [];
    }
}

export function getLabPackageJson(
    rootDir: string,
    lab: string,
): PackageJson | null {
    try {
        return JSON.parse(
            fs.readFileSync(labPackageJsonPath(rootDir, lab), "utf-8"),
        );
    } catch {
        return null;
    }
}

export function splitLabsAndSolutions(labNames: string[]) {
    const labs: string[] = [];
    const labSolutions: string[] = [];
    for (const lab of labNames) {
        if (lab.endsWith("-solution")) {
            labSolutions.push(lab);
        } else {
            labs.push(lab);
        }
    }
    return { labs, labSolutions } as const;
}

export function getLabReadme(rootDir: string, lab: string): string | null {
    try {
        return fs.readFileSync(labReadmePath(rootDir, lab), "utf-8");
    } catch {
        return null;
    }
}
