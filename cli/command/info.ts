import { InfoCommand } from "../cli";
import { isDefined } from "../utils/fp.utils";
import {
    getAllLabsFromWorkspace,
    splitLabsAndSolutions,
} from "../utils/labs.utils";

export function infoCommand({ rootDir }: InfoCommand) {
    const allLabs = getAllLabsFromWorkspace(rootDir);
    const { labs, labSolutions } = splitLabsAndSolutions(allLabs);
    console.log([
        "", //
        "# Labs", //
        "", //
        ...labs.map((lab) => printLab(lab, labSolutions)),
    ].join("\n"));
}

function printLab(lab: string, labSolutions: string[]): string {
    const labSolution = labSolutions.find((labSol) => labSol.startsWith(lab));
    if (isDefined(labSolution)) {
        return ` - ${lab}(-solution)`;
    } else {
        return ` - ${lab}`;
    }
}
