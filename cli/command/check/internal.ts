import { CheckCommand } from "../../cli";
import { checkRootDir } from "./check-root-dir";
import { checkDocs } from "./check-docs";
import { checkLabs } from "./check-labs";
import { getProjectConfig } from "../../utils/config.utils";

export async function checkCommandInternal(command: CheckCommand) {
    checkRootDir(command);
    const config = getProjectConfig(command.rootDir);
    await checkDocs(command.rootDir, config);
    checkLabs(command.rootDir, config);
}
