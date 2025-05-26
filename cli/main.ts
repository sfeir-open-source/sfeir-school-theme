#!/usr/bin/env node
import { parseArgs } from "./cli";
import { runCommand } from "./command/run";
import { CheckError } from "./utils/assert.utils";

(async () => {
    try {
        await runCommand(parseArgs(process.argv, process.cwd()));
    } catch (error) {
        if (error instanceof CheckError) {
            console.error(error.message);
            process.exit(1);
        }
    }
})();
