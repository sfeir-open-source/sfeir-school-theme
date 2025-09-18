import { Command } from "../cli";
import { checkCommand } from "./check/index";
import { explainCommand } from "./explain";
import { helpCommand } from "./help";
import { infoCommand } from "./info";
import { initConfigCommand } from "./init-config";
import { versionCommand } from "./version";

export async function runCommand(command: Command) {
    switch (command.type) {
        case "check":
            await checkCommand(command);
            break;
        case "init-config":
            await initConfigCommand(command);
            break;
        case 'explain':
            explainCommand(command);
            break;
        case "help":
            helpCommand();
            break;
        case "info":
            infoCommand(command);
            break;
        case "version":
            versionCommand();
            break;
        default:
            throw new Error(
                `Command "${JSON.stringify(command)}" not implemented`,
            );
    }
}
