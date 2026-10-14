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

Other commands (separate binaries of the same package):
    sfeir-school-theme-migrate: Migrate a school to the next theme version
        (e.g. --from=v4 --to=v5), see sfeir-school-theme-migrate --help
    sfeir-school-theme-cleanup: Clean up obsolete markup in the slides markdown (empty .slide comments, legacy classes)
`);
}
