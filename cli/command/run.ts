import { Command } from "../cli";
import { checkCommand } from "./check/index";
import { helpCommand } from "./help";
import { versionCommand } from "./version";

export function runCommand(command: Command) {
    switch (command.type) {
        case "check":
            checkCommand(command);
            break;
        case "help":
            helpCommand(command);
            break;
        case "version":
            versionCommand(command);
            break;
    }
}
