export function helpCommand() {
    console.log(`
sfeir-school-theme CLI

Usage:
    sfeir-school-theme [command]

Command:
    help: Display this help message
    info: Give infos on the current school
        --rootDir=/path/to/root/dir
    init-config: Will create config file with the default configuration
        --rootDir=/path/to/root/dir
    version: Display the CLI version
    check: Run project checks
        --rootDir=/path/to/root/dir
    explain [ruleCode]: Give the rule documentation
`);
}
