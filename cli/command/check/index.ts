import { CheckCommand } from "../../cli";
import { checkRootDir } from "./check-root-dir";
import { checkDocs } from "./check-docs";
import { checkSteps } from "./check-steps";
import { getErrors } from "../../utils/assert.utils";
import { getProjectConfig } from "../../utils/config.utils";

export async function checkCommand(command: CheckCommand) {
    checkRootDir(command);
    const config = getProjectConfig(command.rootDir);
    await checkDocs(command.rootDir, config);
    checkSteps(command.rootDir);

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
