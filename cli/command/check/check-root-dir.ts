import { isDirectory, isFile, readdirSync } from '../../utils/fs.utils';
import { CheckCommand } from '../../cli';
import { check } from '../../utils/assert.utils';
import fs from 'node:fs';
import { isDefinedAndNotEmpty } from '../../utils/fp.utils';
import path from 'node:path';

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
        'G_003',
        {
            msg: "Project should have a 'steps' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes('steps') &&
            isDirectory(command.rootDir, 'steps')
    );
    check(
        'G_002',
        {
            msg: "Project should have a 'docs' directory",
            continueCheck: false,
        },
        () =>
            readRootDir(command).includes('docs') &&
            isDirectory(command.rootDir, 'docs')
    );
    const contributionGuideExist = check(
        'G_004',
        "Project should have a 'CONTRIBUTION_GUIDE.md' file",
        () =>
            readRootDir(command).includes('CONTRIBUTION_GUIDE.md') &&
            isFile(command.rootDir, 'CONTRIBUTION_GUIDE.md'),
        'warning'
    );

    if (contributionGuideExist) {
        const requiredSections: string[] = [
            'How to start the slides on local?',
            'How to start a lab?',
            'How to add a new lab?',
            'What tasks to do before push a PR?',
            'What are the specific rules of this training?',
        ];
        const contributionGuide = fs.readFileSync(
            path.resolve(command.rootDir, 'CONTRIBUTION_GUIDE.md'),
            'utf-8'
        );
        const allSectionsExists = requiredSections.every((section) =>
            check(
                'G_004',
                `The 'CONTRIBUTION_GUIDE.md' file should contains required sections ("${section}" is missing)`,
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
                        `All section in the 'CONTRIBUTION_GUIDE.md' file should contains information ("${sectionName}" is missing content)`,
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

function readRootDir(command: CheckCommand) {
    return readdirSync(command.rootDir);
}
