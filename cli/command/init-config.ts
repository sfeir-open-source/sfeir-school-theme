import fs, { cpSync } from "node:fs";
import path from "node:path";
import { InitConfigCommand } from "../cli";
import configTemplateJson from "../config-template.json";
import { getProjectConfigPath } from "../utils/path.utils";

export function initConfigCommand({ rootDir }: InitConfigCommand) {
    const configPath = getProjectConfigPath(rootDir);
    if (fs.existsSync(configPath)) {
        throw new Error("Cannot init config as there is already one.");
    }
    fs.writeFileSync(
        configPath,
        JSON.stringify(configTemplateJson, undefined, 2),
    );
}
