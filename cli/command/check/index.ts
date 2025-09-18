import { CheckCommand } from "../../cli";
import { checkCommandInternal } from "./internal";
import { getErrors } from "../../utils/assert.utils";
import { unique } from "../../utils/array.utils";

export async function checkCommand(command: CheckCommand) {
    await checkCommandInternal(command);

    if (getErrors().length === 0) {
        console.log("OK");
        process.exit(0);
    } else {
        getErrors().forEach((error) => {
            console.error(error.message);
        });
        console.error('');
        const errorIds = unique(getErrors().map(e => e.ruleId)).sort();
        console.error(`You can call "sfeir-school-theme explain ${errorIds.join('|')}" to have more details.`);
        console.error('');
        process.exit(getErrors().length);
    }
}
