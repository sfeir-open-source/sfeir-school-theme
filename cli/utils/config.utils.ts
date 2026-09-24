import configTemplateJson from '../config-template.json';
import fs from 'node:fs';
import { projectConfigPath } from './path.utils';

export interface ConfigJson {
    extraCssFiles: string[];
    labCommandPrefix: string;
    ignoreLabsDirectories: string[]; // Use to ignore internals directories in "labs" directory (for exemple technicals directories used for making labs working but that are not exercices)
    ignoreAssets: string[];
    ignoreCommandCheck: string[]; // Lab slide paths that legitimately have no command to run (e.g. a browser-only or manual lab), exempted from S_005/S_011
}

export function getProjectConfig(rootDir: string): ConfigJson {
    const configPath = projectConfigPath(rootDir);
    if (fs.existsSync(configPath)) {
        return {
            ...(configTemplateJson as ConfigJson),
            ...JSON.parse(fs.readFileSync(configPath, 'utf-8')),
        };
    } else {
        return configTemplateJson as ConfigJson;
    }
}
