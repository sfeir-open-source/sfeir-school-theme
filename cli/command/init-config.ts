import { InitConfigCommand } from "../cli";
import configTemplateJson from "../config-template.json";
import fs from "node:fs";
import { projectConfigPath } from "../utils/path.utils";

export function initConfigCommand({ rootDir }: InitConfigCommand) {
    const configPath = projectConfigPath(rootDir);
    if (fs.existsSync(configPath)) {
        throw new Error("Cannot init config as there is already one.");
    }
    fs.writeFileSync(
        configPath,
        JSON.stringify(configTemplateJson, undefined, 2),
    );
}
