#!/usr/bin/env node
import { CheckError } from "./utils/assert.utils";
import { parseArgs } from "./cli";
import { runCommand } from "./command/run";

(async () => {
    try {
        await runCommand(parseArgs(process.argv, process.cwd()));
    } catch (error) {
        if (error instanceof CheckError) {
            console.error(error.message);
            process.exit(1);
        }
        if (error instanceof Error) {
            console.error(error.message);
            console.error(error.stack);
            process.exit(2);
        }
    }
})();
