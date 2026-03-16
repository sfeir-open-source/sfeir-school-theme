import configTemplateJson from '../config-template.json';
import fs from 'node:fs';
import { projectConfigPath } from './path.utils';

export interface ConfigJson {
    extraCssFiles: string[];
    stepCommandPrefix: string;
    ignoreStepsDirectories: string[]; // Use to ignore internals directories in "steps" directory (for exemple technicals directories used for making steps working but that are not exercices)
    ignoreAssets: string[];
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
