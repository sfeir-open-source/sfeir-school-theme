import { HelpCommand } from "../cli";

export function helpCommand(command: HelpCommand) {
    console.log(`
sfeir-school-theme CLI

Usage:
    sfeir-school-theme [command]

Command:
    help: Display this help message
    version: Display the CLI version
    check: Run project checks
        --rootDir=/path/to/root/dir
`);
}
