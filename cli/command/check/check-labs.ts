import { check } from "../../utils/assert.utils";
import { ConfigJson } from "../../utils/config.utils";
import { isDefined } from "../../utils/fp.utils";
import {
    getAllLabScripts,
    getAllLabsFromFs,
    getAllLabsFromWorkspace,
    getLabPackageJson,
    getLabReadme,
    getWorkspaceStepsPackageJson,
    splitLabsAndSolutions,
} from "../../utils/labs.utils";

export function checkLabs(rootDir: string, config: ConfigJson) {
    checkLabDirectories(rootDir, config);
    checkLabsAndSolutions(rootDir, config);
}

function checkLabDirectories(rootDir: string, config: ConfigJson) {
    const stepsPackageJson = getWorkspaceStepsPackageJson(rootDir);
    const labDirectories = getAllLabsFromFs(rootDir, config);
    const labsDeclared = getAllLabsFromWorkspace(rootDir);
    const labScripts = getAllLabScripts(rootDir);
    for (const labDir of labDirectories) {
        check(
            `Lab "${labDir}" should be declared in the workspace (either "workspaces" or "labs" in a file "package.json" at the root of "steps" directory)`,
            () => labsDeclared.includes(labDir),
        );
        if (stepsPackageJson?.kind === "package.json") {
            check(
                `Lab "${labDir}" should have corresponding script`,
                () => labScripts.includes(labDir),
            );
            check(
                `Lab "${labDir}" should have a package.json with corresponding name`,
                () => getLabPackageJson(rootDir, labDir).name === labDir,
            );
        }
    }
}

function checkLabsAndSolutions(rootDir: string, config: ConfigJson) {
    const labDirectories = getAllLabsFromFs(rootDir, config);
    const { labs, labSolutions } = splitLabsAndSolutions(labDirectories);
    for (const lab of labs) {
        check(
            `Lab "${lab}" should have a solution`,
            () => labSolutions.includes(lab + "-solution"),
        );
        const readme = getLabReadme(rootDir, lab);
        const hasReadme = check(
            `Lab "${lab}" should have a README.md`,
            () => isDefined(readme) && readme.length > 0,
        );
        if (hasReadme) {
            check(
                `Lab "${lab}"'s README.md should contains the correct title`,
                () => readme?.includes(`# ${lab} instructions`) ?? false,
            );
            check(
                `Lab "${lab}"'s README.md should contains the correct command`,
                () =>
                    readme?.includes(`${config.stepCommandPrefix}${lab}`) ??
                        false,
            );
        }
    }
    for (const labSolution of labSolutions) {
        const matchingLabName = labSolution.replace("-solution", "");
        const hasMatchingLab = check(
            `Solution lab "${labSolution}" should match to a lab`,
            () => labs.includes(matchingLabName),
        );
        if (hasMatchingLab) {
            const labReadme = getLabReadme(rootDir, matchingLabName);
            const labSolutionReadme = getLabReadme(rootDir, labSolution);
            check(
                `Lab and solution of "${matchingLabName}" should have same README.md`,
                () => labReadme === labSolutionReadme,
            );
        }
    }
}
