import { isDirectory, readdirSync } from './fs.utils';
import {
    labNoSolutionPath,
    labPackageJsonPath,
    labReadmePath,
    labsDirLabsJsonPath,
    labsDirPackageJsonPath,
    labsPath,
} from './path.utils';
import { ConfigJson } from './config.utils';
import fs from 'node:fs';
import { isNotDefined } from './fp.utils';

export function isLabsDirectoryExists(labsDirPath: string) {
    return fs.existsSync(labsDirPath);
}

/** `labs/` is optional: a school without hands-on exercises has none. */
export function hasLabsDirectory(rootDir: string) {
    return isDirectory(labsPath(rootDir));
}

export interface LabsJson {
    kind: 'labs.json';
    labs: string[];
}

export interface PackageJson extends Partial<Omit<LabsJson, 'kind'>> {
    kind: 'package.json';
    name: string;
    workspaces?: string[];
    scripts?: Record<string, string>;
}

export function getWorkspaceLabsPackageJson(
    rootDir: string
): PackageJson | LabsJson | null {
    const packageJson = labsDirPackageJsonPath(rootDir);
    const labsJson = labsDirLabsJsonPath(rootDir);
    if (fs.existsSync(packageJson)) {
        const raw = JSON.parse(fs.readFileSync(packageJson, 'utf-8'));
        return { ...raw, kind: 'package.json' };
    } else if (fs.existsSync(labsJson)) {
        const raw = JSON.parse(fs.readFileSync(labsJson, 'utf-8'));
        return { ...raw, kind: 'labs.json' };
    } else {
        return null;
    }
}

function extractLabsListFromPackageJson(
    packageJson: PackageJson | LabsJson | null
): string[] {
    if (isNotDefined(packageJson)) {
        return [];
    }
    if (packageJson.kind === 'package.json') {
        return packageJson.workspaces ?? packageJson.labs ?? [];
    }
    if (packageJson.kind === 'labs.json') {
        return packageJson.labs ?? [];
    }
    return [];
}

export function getAllLabsFromWorkspace(
    rootDir: string,
    {
        withSolution = true,
        ignoreLabsDirectories = [],
    }: Partial<Pick<ConfigJson, 'ignoreLabsDirectories'>> & {
        withSolution?: boolean;
    } = {}
): string[] {
    const packageJson = getWorkspaceLabsPackageJson(rootDir);
    const allCommands = extractLabsListFromPackageJson(packageJson).filter(
        (command) => !ignoreLabsDirectories.includes(command)
    );
    if (withSolution) {
        return allCommands;
    } else {
        return allCommands.filter((labCommand) => !isLabSolution(labCommand));
    }
}

export function getLabsCommands(
    rootDir: string,
    {
        withSolution = false,
        ignoreLabsDirectories = [],
    }: Partial<Pick<ConfigJson, 'ignoreLabsDirectories'>> & {
        withSolution?: boolean;
    } = {}
): string[] {
    return getAllLabsFromWorkspace(rootDir, {
        withSolution,
        ignoreLabsDirectories,
    });
}

export function isLabCommandExists(rootDir: string, commandName: string) {
    return getLabsCommands(rootDir).includes(commandName);
}

export function getLabCommandTarget(labCommandRow: string, config: ConfigJson) {
    return labCommandRow.split(config.labCommandPrefix)[1]?.trim();
}

export function getAllLabsFromFs(rootDir: string, config: ConfigJson) {
    if (!hasLabsDirectory(rootDir)) {
        return [];
    }
    return readdirSync(labsPath(rootDir), { encoding: 'utf-8' })
        .filter((filePath) => !config.ignoreLabsDirectories.includes(filePath))
        .filter((filePath) => isDirectory(labsPath(rootDir), filePath));
}

export function getAllLabScripts(rootDir: string): string[] {
    const packageJson = getWorkspaceLabsPackageJson(rootDir);
    if (packageJson?.kind === 'package.json') {
        return Object.keys(packageJson.scripts ?? {});
    } else {
        return [];
    }
}

export function getLabPackageJson(
    rootDir: string,
    lab: string
): PackageJson | null {
    try {
        return JSON.parse(
            fs.readFileSync(labPackageJsonPath(rootDir, lab), 'utf-8')
        );
    } catch {
        return null;
    }
}

export function splitLabsAndSolutions(labNames: string[]) {
    const labs: string[] = [];
    const labSolutions: string[] = [];
    for (const lab of labNames) {
        if (isLabSolution(lab)) {
            labSolutions.push(lab);
        } else {
            labs.push(lab);
        }
    }
    return { labs, labSolutions } as const;
}

const SOLUTION_SUFFIX = '-solution';

/** `NNN-name-lab` (3 digits, kebab-case name) or its `NNN-name-lab-solution`. */
const LAB_DIRECTORY_NAME = /^\d{3}-[a-z0-9]+(-[a-z0-9]+)*-lab(-solution)?$/;

export function isLabSolution(labDirectory: string): boolean {
    return labDirectory.endsWith(SOLUTION_SUFFIX);
}

/** The lab a solution belongs to: `001-foo-lab-solution` → `001-foo-lab`. */
export function getSolutionLab(labSolution: string): string {
    return labSolution.slice(0, -SOLUTION_SUFFIX.length);
}

export function isValidLabDirectoryName(labDirectory: string): boolean {
    return LAB_DIRECTORY_NAME.test(labDirectory);
}

export function getLabReadme(rootDir: string, lab: string): string | null {
    try {
        return fs.readFileSync(labReadmePath(rootDir, lab), 'utf-8');
    } catch {
        return null;
    }
}

export function hasLabNoSolution(rootDir: string, lab: string): boolean {
    try {
        return fs.existsSync(labNoSolutionPath(rootDir, lab));
    } catch {
        return false;
    }
}
