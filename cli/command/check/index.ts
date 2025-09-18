import { CheckCommand } from "../../cli";
import { checkCommandInternal } from "./internal";
import { getErrors } from "../../utils/assert.utils";

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
        console.error(`You can call "sfeir-school-theme explain ${getErrors().map(e => e.ruleId).join('|')}" to have more details.`);
        console.error('');
        process.exit(getErrors().length);
    }
}
