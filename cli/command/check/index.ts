import { CheckCommand } from "../../cli";
import { getErrors } from "../../utils/assert.utils";
import { checkCommandInternal } from "./internal";

export async function checkCommand(command: CheckCommand) {
    checkCommandInternal(command);

    if (getErrors().length === 0) {
        console.log("OK");
        process.exit(0);
    } else {
        getErrors().forEach((error) => {
            console.error(error.message);
        });
        process.exit(getErrors().length);
    }
}
