#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

// #region Migration rules

// V3 -> V4 rules, in the order they must apply
const V3_TO_V4_RULES = {
    MARKDOWN: [
        // 1. Icons with a style (most specific first)
        {
            from: /(!\[sfeir-icons([^\]]*)\]\(([^)]+)\))<!-- \.element: style=\"([^\"]*)\" -->/g,
            to: (
                _match: any,
                _markdownImage: any,
                modifiers: any,
                iconName: any,
                styleContent: any
            ) => {
                let classes = 'tc-icons feather';
                if (modifiers.includes('small')) classes += ' tc-small';
                if (modifiers.includes('big')) classes += ' tc-big';
                const newImage = `![](${iconName} '${classes}')`;

                const newStyleContent = styleContent
                    .replace(/--icon-size/g, '--tc-icon-size')
                    .replace(/--icon-color/g, '--tc-icon-color');
                const newStyleComment = `<!-- .element: style="${newStyleContent}" -->`;

                return newImage + newStyleComment;
            },
        },
        // 2. Icons without a style
        {
            from: /!\[sfeir-icons([^\]]*)\]\(([^)]+)\)(?!<!-- \.element: style=)/g,
            to: (_match: any, modifiers: any, iconName: any) => {
                let classes = 'tc-icons feather';
                if (modifiers.includes('small')) classes += ' tc-small';
                if (modifiers.includes('big')) classes += ' tc-big';
                return `![](${iconName} '${classes}')`;
            },
        },
        // 3. Images with h- or w- classes (more generic)
        {
            from: /!\[([^\]]*?(?:h-|w-)[^\]]*)\]\(([^)]+)\)/g,
            to: "![]($2 '$1')",
        },
        // 4. Images with other CSS classes (float-left, float-right, etc.)
        {
            from: /!\[([^\]]+)\]\(([^)]+)\)(?!<!-- \.element:)/g,
            to: "![]($2 '$1')",
        },
        // 5. Other rules
        { from: /data-background-image-light/g, to: 'data-background-light' },
        { from: /data-background-image-dark/g, to: 'data-background-dark' },
    ],
    HTML: [
        {
            from: /href=\"([^\"]*)\/sfeir-school-theme\/sfeir-school-theme.css\"/g,
            to: 'href="$1/sfeir-school-theme/dist/sfeir-school-theme.css"',
        },
    ],
    JAVASCRIPT: [
        {
            from: /(['"])([^'"]*\/sfeir-school-theme)\/sfeir-school-theme\.mjs(['"])/g,
            to: '$1$2/dist/sfeir-school-theme.mjs$3',
        },
    ],
};

// V4 -> V5 rules (see [[theme-0002-slides-and-docs-directories]],
// [[theme-0003-labs-directory]]): structural rename, not a per-file
// content rewrite, so the rules are directory/key renames rather than regexes.
const V4_TO_V5_RULES = {
    RENAME_DIRECTORIES: [
        {
            from: 'docs',
            to: 'slides',
            // Everything in a v4 docs/ is the deck (index.html, package.json,
            // scss/, markdown/, ...) and moves; only the ADRs stay, since
            // theme-0002 keeps docs/ for ADRs and other documentation.
            // docs/LICENSE is the school's content license: it goes to the
            // root LICENSE-CONTENT (see preserveContentLicense), never slides/.
            keepEntries: ['adr', 'LICENSE'],
        },
        { from: 'steps', to: 'labs' },
    ],
    RENAME_CONFIG_KEYS: [
        { from: 'stepCommandPrefix', to: 'labCommandPrefix' },
        { from: 'ignoreStepsDirectories', to: 'ignoreLabsDirectories' },
    ],
};

// #endregion

// #region Structural migration engine (drives V4_TO_V5_RULES)

function renameDirectory(
    rootDir: string,
    rule: { from: string; to: string; keepEntries?: string[] },
) {
    const fromDir = path.join(rootDir, rule.from);
    const toDir = path.join(rootDir, rule.to);

    if (!fs.existsSync(fromDir)) {
        return;
    }
    if (fs.existsSync(toDir)) {
        console.log(`${rule.to}/ already exists, skipping ${rule.from}/ -> ${rule.to}/ migration.`);
        return;
    }

    if (!rule.keepEntries) {
        fs.renameSync(fromDir, toDir);
        console.log(`Renamed ${rule.from}/ to ${rule.to}/.`);
        return;
    }

    const entries = fs.readdirSync(fromDir)
        .filter((entry) => !rule.keepEntries!.includes(entry));
    if (entries.length === 0) {
        console.log(`No content found in ${rule.from}/ to move to ${rule.to}/.`);
        return;
    }

    console.log(`Migrating ${rule.from}/ content to ${rule.to}/ (${entries.join(', ')})...`);
    fs.mkdirSync(toDir, { recursive: true });
    for (const entry of entries) {
        fs.renameSync(path.join(fromDir, entry), path.join(toDir, entry));
    }

    const remaining = fs.readdirSync(fromDir);
    if (remaining.length === 0) {
        fs.rmdirSync(fromDir);
        console.log(`${rule.from}/ was left empty after migration and has been removed.`);
    } else {
        console.log(`${rule.from}/ still contains ${remaining.join(', ')} (kept).`);
    }
}

function migrateConfigKeys(rootDir: string) {
    const configPath = path.join(rootDir, '.sfeir-theme-config.json');
    if (!fs.existsSync(configPath)) {
        return;
    }

    const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    let changed = false;
    for (const { from, to } of V4_TO_V5_RULES.RENAME_CONFIG_KEYS) {
        if (from in raw) {
            raw[to] = raw[from];
            delete raw[from];
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(configPath, JSON.stringify(raw, null, 4) + '\n', 'utf-8');
        console.log(
            'Migrated .sfeir-theme-config.json keys: ' +
            V4_TO_V5_RULES.RENAME_CONFIG_KEYS.map((r) => `${r.from} -> ${r.to}`).join(', '),
        );
    }
}

// This script ships two ways: compiled to dist/sfeir-school-theme-migration.mjs
// (sibling of dist/adr/, one level below the package root and its LICENSE), or
// run directly from scripts/ during local development (docs/adr/ and LICENSE
// one level up). Try both layouts, in that order.
function resolveMigrationAsset(...candidateRelativePaths: string[]): string | undefined {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return candidateRelativePaths
        .map((relativePath) => path.join(here, relativePath))
        .find((candidate) => fs.existsSync(candidate));
}

export type MigrationSources = {
    /** Directory holding the theme's published ADRs (SEEDED_ADRS). */
    adrDir: string | undefined;
    /** The theme's own LICENSE file (Apache-2.0). */
    license: string | undefined;
};

function defaultSources(): MigrationSources {
    return {
        adrDir: resolveMigrationAsset('adr', path.join('..', 'docs', 'adr')),
        license: resolveMigrationAsset(path.join('..', 'LICENSE')),
    };
}

function seedFile(targetPath: string, write: () => void) {
    if (fs.existsSync(targetPath)) {
        console.log(`${targetPath} already exists, leaving it untouched.`);
        return;
    }
    write();
    console.log(`Created ${targetPath}.`);
}

// See [[theme-0002-slides-and-docs-directories]]: docs/ is reserved for ADRs
// even after its slide content moves to slides/. A migrated project must end
// up with a docs/adr/ that at least states it adopts ADRs
// ([[theme-0000-adopt-adrs]]) and complies with the theme's own ones
// ([[theme-0001-comply-with-theme-adrs]]). Each tier keeps its own prefixed
// sequence, so these are copied as-is (same name, same content); existing
// files are never overwritten.
export const SEEDED_ADRS = [
    'theme-0000-adopt-adrs.md',
    'theme-0001-comply-with-theme-adrs.md',
];

export function ensureAdrBootstrap(rootDir: string, sourceAdrDir: string | undefined) {
    const adrDir = path.join(rootDir, 'docs', 'adr');
    fs.mkdirSync(adrDir, { recursive: true });

    for (const name of SEEDED_ADRS) {
        const sourcePath = sourceAdrDir && path.join(sourceAdrDir, name);
        if (!sourcePath || !fs.existsSync(sourcePath)) {
            console.error(`Could not find the bundled ADR "${name}". Skipping.`);
            continue;
        }
        const targetPath = path.join(adrDir, name);
        seedFile(targetPath, () => fs.copyFileSync(sourcePath, targetPath));
    }
}

export const LICENSE_CONTENT_TEXT = `Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)

The slides (slides/) and other learner-facing material of this project
(lab instructions, images, documentation) are licensed under CC BY-ND 4.0.
Code (labs/ and tooling) is licensed separately, see LICENSE.

Legal code: https://creativecommons.org/licenses/by-nd/4.0/legalcode
`;

// See [[theme-0015-opensource-license]]: a school carries LICENSE (Apache-2.0,
// code) and LICENSE-CONTENT (CC BY-ND 4.0, content). Seeded when absent,
// never overwritten: any LICENSE[.md|.txt] already present is the school's
// own choice.
export function ensureLicenses(rootDir: string, sourceLicense: string | undefined) {
    const hasCodeLicense = fs
        .readdirSync(rootDir)
        .some((name) => /^licen[cs]e(\.(md|txt))?$/i.test(name));
    if (hasCodeLicense) {
        console.log('A LICENSE file already exists, leaving it untouched.');
    } else if (!sourceLicense) {
        console.error('Could not find the theme LICENSE to seed. Skipping.');
    } else {
        const target = path.join(rootDir, 'LICENSE');
        seedFile(target, () => fs.copyFileSync(sourceLicense, target));
    }

    const contentLicense = path.join(rootDir, 'LICENSE-CONTENT');
    seedFile(contentLicense, () =>
        fs.writeFileSync(contentLicense, LICENSE_CONTENT_TEXT, 'utf-8'),
    );
}

// See [[theme-0015-opensource-license]]: a v4 school keeps its content
// license (usually CC BY-ND 3.0) in docs/LICENSE. It is the school's existing
// choice, so it becomes the root LICENSE-CONTENT as-is (ensureLicenses then
// leaves it untouched). If LICENSE-CONTENT already exists, nothing moves.
function preserveContentLicense(rootDir: string) {
    const legacyLicense = path.join(rootDir, 'docs', 'LICENSE');
    const contentLicense = path.join(rootDir, 'LICENSE-CONTENT');
    if (!fs.existsSync(legacyLicense)) {
        return;
    }
    if (fs.existsSync(contentLicense)) {
        console.warn(
            'Both docs/LICENSE and LICENSE-CONTENT exist: docs/LICENSE left in place, ' +
            'reconcile them by hand.',
        );
        return;
    }
    fs.renameSync(legacyLicense, contentLicense);
    console.log(
        'docs/LICENSE moved to LICENSE-CONTENT (kept as-is: theme-0015 recommends ' +
        "CC BY-ND 4.0, upgrading is the owner's call).",
    );
}

export function runV4ToV5StructuralMigration(
    rootDir: string,
    sources: MigrationSources = defaultSources(),
) {
    preserveContentLicense(rootDir);
    for (const rule of V4_TO_V5_RULES.RENAME_DIRECTORIES) {
        renameDirectory(rootDir, rule);
    }
    migrateConfigKeys(rootDir);
    ensureAdrBootstrap(rootDir, sources.adrDir);
    ensureLicenses(rootDir, sources.license);
}

// #endregion

function applyRules(
    content: string,
    rules: {
        from: RegExp;
        to: string | ((substring: string, ...args: any[]) => string);
    }[]
) {
    let newContent = content;
    for (const rule of rules) {
        newContent = newContent.replace(rule.from, rule.to as any);
    }
    return newContent;
}

function migrateMultiColumnSlides(content: string): string {
    // Split the content into sections delimited by ##==##
    const sections = content.split(/(##==##)/);

    const processedSections = sections.map((section) => {
        // Leave the ##==## separators as-is
        if (section === '##==##') {
            return section;
        }

        // Look for a multi-column slide in this section
        const multiColumnMatch = section.match(
            /([\s\S]*?)(<!-- \.slide: class=\"[^\"]*(?:two-column-layout|two-column)[^\"]*\"[^>]*-->)([\s\S]*)/
        );

        if (!multiColumnMatch) {
            return section; // No multi-column slide: return it as-is
        }

        console.log('Migrating a multi-column slide...');

        const [, contentBefore, slideTag, slideContent] = multiColumnMatch;

        // Trim the content before the slide tag
        const cleanContentBefore = contentBefore.trim();

        // Replace the class in the slide tag
        const newSlideTag = slideTag.replace(
            /(?:two-column-layout|two-column)/g,
            'tc-multiple-columns'
        );

        // Split the Notes from the main content
        const notesMatch = slideContent.match(
            /(Notes:\s*[\s\S]*?)(?=##--##|##==##|$)/
        );
        const notes = notesMatch ? notesMatch[1].trim() : '';

        // Remove the Notes from the content before processing the columns
        let contentWithoutNotes = slideContent;
        if (notes) {
            contentWithoutNotes = slideContent
                .replace(/(Notes:\s*[\s\S]*?)(?=##--##|##==##|$)/, '')
                .trim();
        }

        // Split the content into columns on ##--##
        const columns = contentWithoutNotes.split(/##--##/);

        // Process each column
        const processedColumns = columns
            .map((col: any, colIndex: number) => {
                col = col.trim();

                // First column: prepend the content that was before the slide tag
                if (colIndex === 0 && cleanContentBefore) {
                    col = cleanContentBefore + '\n\n' + col;
                }

                // Does the column hold a slide tag?
                const slideMatch = col.match(
                    /<!--\s*\.slide:\s*([^>]*?)\s*-->/
                );

                if (slideMatch) {
                    // Extract the slide attributes
                    const slideAttributes = slideMatch[1].trim();

                    // Extract the content after the slide tag
                    const contentAfterSlideTag = col
                        .replace(/<!--\s*\.slide:\s*[^>]*?\s*-->/, '')
                        .trim();

                    if (contentAfterSlideTag) {
                        return `##++## ${slideAttributes}\n\n${contentAfterSlideTag}`;
                    } else {
                        return `##++## ${slideAttributes}`;
                    }
                } else {
                    // Plain content: wrap it in ##++##
                    if (col.length > 0) {
                        return `##++##\n\n${col}`;
                    }
                    return '##++##\n';
                }
            })
            .filter((col: any) => col.length > 0);

        // Rebuild the slide
        let result = newSlideTag + '\n\n' + processedColumns.join('\n##++##\n');

        // Append ##++## at the end
        if (!result.endsWith('##++##')) {
            result += '\n##++##\n';
        }

        // Append the Notes at the end, if any
        if (notes) {
            result += '\n\n' + notes;
        }

        return result;
    });

    return processedSections.join('\n');
}

function migrateSpeakerSlides(content: string): string {
    const slideRegex =
        /(<!-- \.slide: class=\"[^\"]*\bspeaker-slide\b[^\"]*\"[^>]* -->)\s*([\s\S]*?)(?=\n<!-- \.slide:|##==##|##--##|Notes:|$)/g;

    return content.replace(
        slideRegex,
        (_fullMatch: any, slideTag: any, slideContent: any) => {
            console.log('Migrating a speaker slide...');

            // First, apply the image rules to the slide content
            let processedContent = slideContent;

            // Apply the image rules specifically
            processedContent = processedContent.replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                (_match: any, alt: any, src: any) => `![](${src} '${alt}')`
            );

            // Remove comments with class=\"icon..."
            processedContent = processedContent.replace(
                /<!-- \.element: class=\"icon[^\"]*\" -->/g,
                ''
            );

            // Remove 'first-badge', 'second-badge', 'third-badge' (just in case)
            processedContent = processedContent.replace(
                /(first-badge|second-badge|third-badge)/g,
                'badge'
            );

            // Add a blank line after each image (unless one already follows)
            processedContent = processedContent.replace(
                /!\[[^\]]*\]\([^)]+\s+'[^']+'\)(?!\n\s*\n)/g,
                (match: any) => match + '\n'
            );

            // Collapse runs of more than 2 blank lines
            processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

            // Wrap in a div
            const newContent = `<div class="speaker-slide">\n\n${processedContent.trim()}\n\n</div>`;

            return `${slideTag}\n\n${newContent}\n\n`;
        }
    );
}

function processFullCenterImages(content: string): string {
    // Matches images with 'full-center' in their classes
    const fullCenterImageRegex =
        /!\[\]\(([^)]+)\s+'([^']*\bfull-center\b[^']*)'\)/g;

    return content.replace(fullCenterImageRegex, (_, src, classes) => {
        // Remove 'full-center' from the classes
        const cleanedClasses = classes
            .split(/\s+/)
            .filter((cls: string) => cls !== 'full-center')
            .join(' ')
            .trim();

        // Build the new image
        let newImage;
        if (cleanedClasses) {
            newImage = `![](${src} '${cleanedClasses}')`;
        } else {
            newImage = `![](${src})`;
        }

        // Add the comment carrying the full-center class
        return `${newImage} \n<!-- .element: class="full-center" -->`;
    });
}

function migrateFile(filePath: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;
        const extension = path.extname(filePath);

        console.log(
            `Migrating file :  ${filePath} with extension ${extension}`
        );
        if (extension === '.md') {
            content = migrateSpeakerSlides(content); // Before the other rules
            content = migrateMultiColumnSlides(content);
            content = applyRules(content, V3_TO_V4_RULES.MARKDOWN);
            content = processFullCenterImages(content);
        } else if (extension === '.html') {
            content = applyRules(content, V3_TO_V4_RULES.HTML);
        } else if (extension === '.js') {
            console.log('try to migrate file JS : ', filePath);
            content = applyRules(content, V3_TO_V4_RULES.JAVASCRIPT);
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Successfully migrated: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error migrating file ${filePath}:`, error);
    }
}

// Vendored code, never rewritten.
const SKIPPED_DIRECTORIES = ['web_modules', 'node_modules'];

function findFiles(dir: string, filter: RegExp): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file: any) {
        const fullPath = path.join(dir, file);
        if (SKIPPED_DIRECTORIES.includes(path.basename(fullPath))) {
            return;
        }
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(fullPath, filter));
        } else {
            if (filter.test(fullPath)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

export function runV3ToV4ContentMigration(rootDir: string) {
    // A project already migrated to V5 has no docs/ left to walk; fall back
    // to slides/ so this transition still works when re-run in isolation.
    const slidesDir = path.join(rootDir, 'slides');
    const legacyDocsDir = path.join(rootDir, 'docs');
    const targetDir = fs.existsSync(slidesDir) ? slidesDir : legacyDocsDir;

    if (!fs.existsSync(targetDir)) {
        console.error(`Error: neither slides/ nor docs/ found under ${rootDir}`);
        return;
    }

    console.log(`Starting content migration in: ${targetDir}`);
    // docs/adr/ holds ADRs, not slides ([[theme-0002-slides-and-docs-directories]]):
    // the slide syntax rewrite must never touch it.
    const adrDir = path.join(targetDir, 'adr') + path.sep;
    const filesToMigrate = findFiles(targetDir, /\.(md|html|js)$/)
        .filter((file) => !file.startsWith(adrDir));

    if (filesToMigrate.length === 0) {
        console.log('No relevant files (.md, .html, .js) found to migrate.');
        return;
    }

    console.log(`Found ${filesToMigrate.length} files to migrate.`);
    filesToMigrate.forEach(migrateFile);
}

type MigrationTransition = {
    from: string;
    to: string;
    run: (rootDir: string) => void;
};

const TRANSITIONS: MigrationTransition[] = [
    { from: 'v3', to: 'v4', run: runV3ToV4ContentMigration },
    { from: 'v4', to: 'v5', run: (rootDir) => runV4ToV5StructuralMigration(rootDir) },
];

const USAGE = `Usage: sfeir-school-theme-migrate [--from=<version>] [--to=<version>]

Migrates the sfeir-school project in the current directory (or its parent,
when run from slides/ or docs/). Review the changes before committing.

Options:
  --from=<version>  run the transition(s) starting from this version
  --to=<version>    run the transition(s) ending at this version
  -h, --help        print this help and exit

At least one of --from/--to is required: each flag filters the transitions
below, so a single flag runs the matching one (--to=v5 runs v4 -> v5).
Without any flag, the command prints this help and exits with code 1.

Transitions (run one at a time, oldest first):
${TRANSITIONS.map((t) => `  ${t.from} -> ${t.to}`).join('\n')}

Examples:
  sfeir-school-theme-migrate --from=v3 --to=v4   # v3 content -> v4 syntax
  sfeir-school-theme-migrate --from=v4 --to=v5   # slides/, labs/, ADRs, licenses
  sfeir-school-theme-migrate --to=v5             # same as above
`;

class UsageError extends Error {}

type CliCommand = { kind: 'help' } | { kind: 'run'; transitions: MigrationTransition[] };

function parseCliArgs(argv: string[]): CliCommand {
    const versions: { from?: string; to?: string } = {};
    for (const arg of argv) {
        if (arg === '--help' || arg === '-h') {
            return { kind: 'help' };
        }
        const match = arg.match(/^--(from|to)=(.+)$/);
        if (!match) {
            throw new UsageError(`Unknown argument: ${arg}`);
        }
        versions[match[1] as 'from' | 'to'] = match[2];
    }

    const { from, to } = versions;
    if (!from && !to) {
        // No default: running every transition would re-apply v3 -> v4 to an
        // already-migrated project and rewrite its image alt text into classes.
        throw new UsageError('Missing --from/--to: pick the transition to run.');
    }

    const transitions = TRANSITIONS.filter(
        (t) => (!from || t.from === from) && (!to || t.to === to),
    );
    if (transitions.length === 0) {
        throw new Error(
            `No known migration matches --from=${from ?? '*'} --to=${to ?? '*'}. ` +
            `Known transitions: ${TRANSITIONS.map((t) => `${t.from}->${t.to}`).join(', ')}`,
        );
    }
    return { kind: 'run', transitions };
}

/** Runs the CLI against `currentDir`; returns the process exit code. */
export function runCli(argv: string[], currentDir: string): number {
    let command: CliCommand;
    try {
        command = parseCliArgs(argv);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        if (error instanceof UsageError) {
            console.error(`\n${USAGE}`);
        }
        return 1;
    }

    if (command.kind === 'help') {
        console.log(USAGE);
        return 0;
    }

    // Legacy convenience: running the script from inside the old docs/ (now
    // slides/) directory should still resolve the project root correctly.
    const rootDir = ['docs', 'slides'].includes(path.basename(currentDir))
        ? path.dirname(currentDir)
        : currentDir;

    for (const transition of command.transitions) {
        console.log(`\n=== Migration ${transition.from} -> ${transition.to} ===`);
        transition.run(rootDir);
    }

    console.log('\nMigration complete!');
    console.log('Please review the changes carefully.');
    return 0;
}

// Only run when executed as the bin (npm links it through a symlink), not
// when imported by the tests.
const invokedPath = process.argv[1] && fs.realpathSync(process.argv[1]);
if (invokedPath === fs.realpathSync(fileURLToPath(import.meta.url))) {
    process.exitCode = runCli(process.argv.slice(2), process.cwd());
}
