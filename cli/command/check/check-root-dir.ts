import {
    LEGACY_CONFIG_KEYS,
    getUnknownConfigKeys,
} from '../../utils/config.utils';
import { isDefined, isDefinedAndNotEmpty } from '../../utils/fp.utils';
import { isDirectory, isFile, readdirSync } from '../../utils/fs.utils';
import { CheckCommand } from '../../cli';
import { check } from '../../utils/assert.utils';
import fs from 'node:fs';
import path from 'node:path';

/** Accepted names of the contribution guide, in lookup order (theme-0002). */
const CONTRIBUTION_GUIDE_NAMES = ['CONTRIBUTION_GUIDE.md', 'CONTRIBUTING.md'];

export function checkRootDir(command: CheckCommand) {
    check(
        'G_001',
        {
            msg: `Project root dir (${command.rootDir}) does not exist.`,
            continueCheck: false,
        },
        () => isDirectory(command.rootDir)
    );
    check(
        'G_002',
        {
            msg: hasLegacySlideDeck(command.rootDir)
                ? `Project should have a 'slides' directory: 'docs' still holds a legacy slide deck, run "npx sfeir-school-theme-migrate --from=v4 --to=v5" (a v3 school runs "--from=v3 --to=v4" first)`
                : "Project should have a 'slides' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes('slides') &&
            isDirectory(command.rootDir, 'slides')
    );
    const contributionGuideName = CONTRIBUTION_GUIDE_NAMES.find(
        (name) =>
            readRootDir(command).includes(name) && isFile(command.rootDir, name)
    );
    const contributionGuideExist = check(
        'G_004',
        `Project should have a ${CONTRIBUTION_GUIDE_NAMES.map((name) => `'${name}'`).join(' or ')} file`,
        () => isDefined(contributionGuideName),
        'warning'
    );

    if (contributionGuideExist && isDefined(contributionGuideName)) {
        const requiredSections: string[] = [
            'How to start the slides on local?',
            'How to start a lab?',
            'How to add a new lab?',
            'What tasks to do before push a PR?',
            'What are the specific rules of this training?',
        ];
        const contributionGuide = fs.readFileSync(
            path.resolve(command.rootDir, contributionGuideName),
            'utf-8'
        );
        const allSectionsExists = requiredSections.every((section) =>
            check(
                'G_004',
                `The '${contributionGuideName}' file should contains required sections ("${section}" is missing)`,
                () => contributionGuide.includes(`## ${section}`),
                'warning'
            )
        );
        if (allSectionsExists) {
            const contributionGuideSections: Record<string, string[]> = {};

            let currentSectionName = '';
            let currentSection: string[] = [];
            for (const row of contributionGuide.split('\n').slice(1)) {
                if (!row.startsWith('## ') && currentSectionName === '') {
                    continue;
                }
                if (row.startsWith('## ')) {
                    if (currentSection.length > 0) {
                        contributionGuideSections[currentSectionName] =
                            currentSection.filter((x) =>
                                isDefinedAndNotEmpty(x?.trim())
                            );
                    }
                    currentSection = [];
                    currentSectionName = row.replace('## ', '').trim();
                } else {
                    currentSection.push(row);
                }
            }
            contributionGuideSections[currentSectionName] =
                currentSection.filter((x) => isDefinedAndNotEmpty(x?.trim()));

            Object.entries(contributionGuideSections).every(
                ([sectionName, section]) =>
                    check(
                        'G_004',
                        `All section in the '${contributionGuideName}' file should contains information ("${sectionName}" is missing content)`,
                        () =>
                            section.some((x) =>
                                isDefinedAndNotEmpty(x?.trim())
                            ),
                        'warning'
                    )
            );
        }
    }
}

export function checkProjectConfig(rootDir: string) {
    for (const key of getUnknownConfigKeys(rootDir)) {
        // Own-property check: a key like "constructor" must not hit Object.prototype
        const hint = Object.prototype.hasOwnProperty.call(
            LEGACY_CONFIG_KEYS,
            key
        )
            ? `renamed "${LEGACY_CONFIG_KEYS[key]}", run "npx sfeir-school-theme-migrate --from=v4 --to=v5"`
            : 'it is ignored';
        check(
            'G_005',
            `Unknown key "${key}" in '.sfeir-theme-config.json' (${hint})`,
            () => false,
            'warning'
        );
    }
}

/** A pre-v5 project keeps its deck (`scripts/slides.js`, `markdown/`) under `docs/`. */
function hasLegacySlideDeck(rootDir: string) {
    return (
        isFile(rootDir, 'docs/scripts/slides.js') ||
        isDirectory(rootDir, 'docs/markdown')
    );
}

function readRootDir(command: CheckCommand) {
    return readdirSync(command.rootDir);
}
