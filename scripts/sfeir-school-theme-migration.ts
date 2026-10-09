#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

// #region Règles de migration

// Règles V3 -> V4 avec le bon ordre
const V3_TO_V4_RULES = {
    MARKDOWN: [
        // 1. Icônes avec style (plus spécifique en premier)
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
        // 2. Icônes sans style
        {
            from: /!\[sfeir-icons([^\]]*)\]\(([^)]+)\)(?!<!-- \.element: style=)/g,
            to: (_match: any, modifiers: any, iconName: any) => {
                let classes = 'tc-icons feather';
                if (modifiers.includes('small')) classes += ' tc-small';
                if (modifiers.includes('big')) classes += ' tc-big';
                return `![](${iconName} '${classes}')`;
            },
        },
        // 3. Images avec classes h- ou w- (plus générique)
        {
            from: /!\[([^\]]*?(?:h-|w-)[^\]]*)\]\(([^)]+)\)/g,
            to: "![]($2 '$1')",
        },
        // 4. Images avec autres classes CSS (float-left, float-right, etc.)
        {
            from: /!\[([^\]]+)\]\(([^)]+)\)(?!<!-- \.element:)/g,
            to: "![]($2 '$1')",
        },
        // 4. Autres règles
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

// Règles V4 -> V5 (see ADR-0001, ADR-0002): structural rename, not a per-file
// content rewrite, so the rules are directory/key renames rather than regexes.
const V4_TO_V5_RULES = {
    RENAME_DIRECTORIES: [
        {
            from: 'docs',
            to: 'slides',
            // Only these entries move; anything else stays in docs/ (ADR-0001
            // reserves it for ADRs and other documentation).
            onlyEntries: ['scripts', 'markdown', 'assets', 'css', 'web_modules'],
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
    rule: { from: string; to: string; onlyEntries?: string[] },
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

    if (!rule.onlyEntries) {
        fs.renameSync(fromDir, toDir);
        console.log(`Renamed ${rule.from}/ to ${rule.to}/.`);
        return;
    }

    const entries = fs.readdirSync(fromDir)
        .filter((entry) => rule.onlyEntries!.includes(entry));
    if (entries.length === 0) {
        console.log(`No known content found in ${rule.from}/ to move to ${rule.to}/.`);
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
// (sibling of dist/adr/ and dist/migration-templates/), or run directly from
// scripts/ during local development (sibling of docs/adr/ one level up, and
// of scripts/migration-templates/). Try both layouts, in that order.
function resolveMigrationAsset(...candidateRelativePaths: string[]): string | undefined {
    const here = path.dirname(fileURLToPath(import.meta.url));
    return candidateRelativePaths
        .map((relativePath) => path.join(here, relativePath))
        .find((candidate) => fs.existsSync(candidate));
}

// A destination project's docs/adr/ numbering is independent of this
// repo's (see ADR-0000: "one flat sequence per repository"), and may
// already contain other entries by the time it's migrated. So a seeded
// ADR's number is never copied verbatim from this repo: it is recomputed
// as the next available number in the destination, and only its title
// heading's own number is rewritten to match — the rest of the content,
// including cross-references to this repo's other ADR numbers, is left
// as-is.
function hasAdrWithSlug(adrDir: string, slug: string): boolean {
    if (!fs.existsSync(adrDir)) {
        return false;
    }
    return fs.readdirSync(adrDir).some((name) => name.endsWith(`-${slug}.md`));
}

function nextAdrNumber(adrDir: string): string {
    const entries = fs.existsSync(adrDir) ? fs.readdirSync(adrDir) : [];
    const numbers = entries
        .map((name) => name.match(/^(\d{4})-/)?.[1])
        .filter((n): n is string => n !== undefined)
        .map(Number);
    const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 0;
    return String(next).padStart(4, '0');
}

function seedNumberedAdr(adrDir: string, slug: string, sourcePath: string | undefined) {
    if (hasAdrWithSlug(adrDir, slug)) {
        console.log(`An ADR ending in "-${slug}.md" already exists in ${adrDir}, leaving it untouched.`);
        return;
    }
    if (!sourcePath) {
        console.error(`Could not find the bundled ADR source for "${slug}". Skipping.`);
        return;
    }

    const oldNumber = path.basename(sourcePath).match(/^(\d{4})-/)?.[1];
    const newNumber = nextAdrNumber(adrDir);
    const targetPath = path.join(adrDir, `${newNumber}-${slug}.md`);

    let content = fs.readFileSync(sourcePath, 'utf-8');
    if (oldNumber) {
        content = content.replace(`# ${oldNumber}.`, `# ${newNumber}.`);
    }

    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`Created ${targetPath}.`);
}

// See ADR-0001: docs/ is reserved for ADRs even after its slide content
// moves to slides/. A migrated project must end up with a docs/adr/ that at
// least states it adopts ADRs ([[0000-adopt-adrs]]) and complies with the
// theme's own ones ([[0001-comply-with-theme-adrs]]) — existing files are
// never overwritten.
function ensureAdrBootstrap(rootDir: string) {
    const adrDir = path.join(rootDir, 'docs', 'adr');
    fs.mkdirSync(adrDir, { recursive: true });

    seedNumberedAdr(
        adrDir,
        'adopt-adrs',
        resolveMigrationAsset(
            path.join('adr', '0000-adopt-adrs.md'), // published dist/ layout
            path.join('..', 'docs', 'adr', '0000-adopt-adrs.md'), // local dev layout
        ),
    );

    seedNumberedAdr(
        adrDir,
        'comply-with-theme-adrs',
        resolveMigrationAsset(
            path.join('adr', '0001-comply-with-theme-adrs.md'),
            path.join('..', 'docs', 'adr', '0001-comply-with-theme-adrs.md'),
        ),
    );
}

function runV4ToV5StructuralMigration(rootDir: string) {
    for (const rule of V4_TO_V5_RULES.RENAME_DIRECTORIES) {
        renameDirectory(rootDir, rule);
    }
    migrateConfigKeys(rootDir);
    ensureAdrBootstrap(rootDir);
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
    // Diviser le contenu en sections délimitées par ##==##
    const sections = content.split(/(##==##)/);

    const processedSections = sections.map((section) => {
        // Ne pas traiter les séparateurs ##==##
        if (section === '##==##') {
            return section;
        }

        // Chercher s'il y a un slide multi-colonnes dans cette section
        const multiColumnMatch = section.match(
            /([\s\S]*?)(<!-- \.slide: class=\"[^\"]*(?:two-column-layout|two-column)[^\"]*\"[^>]*-->)([\s\S]*)/
        );

        if (!multiColumnMatch) {
            return section; // Pas de slide multi-colonnes, on retourne tel quel
        }

        console.log('Migrating a multi-column slide...');

        const [, contentBefore, slideTag, slideContent] = multiColumnMatch;

        // Nettoyer le contenu avant
        const cleanContentBefore = contentBefore.trim();

        // Remplacer la classe dans le tag de slide
        const newSlideTag = slideTag.replace(
            /(?:two-column-layout|two-column)/g,
            'tc-multiple-columns'
        );

        // Séparer les Notes du contenu principal avec la regex robuste
        const notesMatch = slideContent.match(
            /(Notes:\s*[\s\S]*?)(?=##--##|##==##|$)/
        );
        const notes = notesMatch ? notesMatch[1].trim() : '';

        // Enlever les Notes du contenu pour traiter les colonnes
        let contentWithoutNotes = slideContent;
        if (notes) {
            contentWithoutNotes = slideContent
                .replace(/(Notes:\s*[\s\S]*?)(?=##--##|##==##|$)/, '')
                .trim();
        }

        // Diviser le contenu en colonnes en utilisant ##--##
        const columns = contentWithoutNotes.split(/##--##/);

        // Traiter chaque colonne
        const processedColumns = columns
            .map((col: any, colIndex: number) => {
                col = col.trim();

                // Pour la première colonne, ajouter le contenu qui était avant le slide tag
                if (colIndex === 0 && cleanContentBefore) {
                    col = cleanContentBefore + '\n\n' + col;
                }

                // Vérifier si la colonne contient un tag de slide
                const slideMatch = col.match(
                    /<!--\s*\.slide:\s*([^>]*?)\s*-->/
                );

                if (slideMatch) {
                    // Extraire les attributs de la slide
                    const slideAttributes = slideMatch[1].trim();

                    // Extraire le contenu après le tag de slide
                    const contentAfterSlideTag = col
                        .replace(/<!--\s*\.slide:\s*[^>]*?\s*-->/, '')
                        .trim();

                    if (contentAfterSlideTag) {
                        return `##++## ${slideAttributes}\n\n${contentAfterSlideTag}`;
                    } else {
                        return `##++## ${slideAttributes}`;
                    }
                } else {
                    // Si c'est du contenu normal, on l'entoure de ##++##
                    if (col.length > 0) {
                        return `##++##\n\n${col}`;
                    }
                    return '##++##\n';
                }
            })
            .filter((col: any) => col.length > 0);

        // Reconstruire le slide
        let result = newSlideTag + '\n\n' + processedColumns.join('\n##++##\n');

        // Ajouter ##++## à la fin
        if (!result.endsWith('##++##')) {
            result += '\n##++##\n';
        }

        // Ajouter les Notes à la fin si elles existent
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

            // D'abord, appliquer les règles d'images sur le contenu de la slide
            let processedContent = slideContent;

            // Appliquer les règles d'images spécifiquement
            processedContent = processedContent.replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g,
                (_match: any, alt: any, src: any) => `![](${src} '${alt}')`
            );

            // Remove comments with class=\"icon..."
            processedContent = processedContent.replace(
                /<!-- \.element: class=\"icon[^\"]*\" -->/g,
                ''
            );

            // Remove 'first-badge', 'second-badge', 'third-badge' (au cas où)
            processedContent = processedContent.replace(
                /(first-badge|second-badge|third-badge)/g,
                'badge'
            );

            // Ajouter des lignes vides après chaque image (sauf si elle est déjà suivie d'une ligne vide)
            processedContent = processedContent.replace(
                /!\[[^\]]*\]\([^)]+\s+'[^']+'\)(?!\n\s*\n)/g,
                (match: any) => match + '\n'
            );

            // Nettoyer les lignes vides multiples (plus de 2 consécutives)
            processedContent = processedContent.replace(/\n{3,}/g, '\n\n');

            // Wrap in a div
            const newContent = `<div class="speaker-slide">\n\n${processedContent.trim()}\n\n</div>`;

            return `${slideTag}\n\n${newContent}\n\n`;
        }
    );
}

function processFullCenterImages(content: string): string {
    // Regex pour capturer les images avec 'full-center' dans les classes
    const fullCenterImageRegex =
        /!\[\]\(([^)]+)\s+'([^']*\bfull-center\b[^']*)'\)/g;

    return content.replace(fullCenterImageRegex, (_, src, classes) => {
        // Enlever 'full-center' des classes
        const cleanedClasses = classes
            .split(/\s+/)
            .filter((cls: string) => cls !== 'full-center')
            .join(' ')
            .trim();

        // Construire la nouvelle image
        let newImage;
        if (cleanedClasses) {
            newImage = `![](${src} '${cleanedClasses}')`;
        } else {
            newImage = `![](${src})`;
        }

        // Ajouter le commentaire avec la classe full-center
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
            content = migrateSpeakerSlides(content); // Avant les autres règles
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

function findFiles(dir: string, filter: RegExp): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file: any) {
        const fullPath = path.join(dir, file);
        if (
            path.basename(fullPath) === 'web_modules' ||
            path.basename(fullPath) === 'node_modules'
        ) {
            return; // Skip web_modules directory
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

function runV3ToV4ContentMigration(rootDir: string) {
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
    const filesToMigrate = findFiles(targetDir, /\.(md|html|js)$/);

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
    { from: 'v4', to: 'v5', run: runV4ToV5StructuralMigration },
];

function parseVersionArg(argv: string[], flag: string): string | undefined {
    return argv.find((arg) => arg.startsWith(`${flag}=`))?.split('=')[1];
}

function selectTransitions(argv: string[]): MigrationTransition[] {
    const from = parseVersionArg(argv, '--from');
    const to = parseVersionArg(argv, '--to');

    if (!from && !to) {
        // No flags: run every known transition, oldest first.
        return TRANSITIONS;
    }

    const selected = TRANSITIONS.filter(
        (t) => (!from || t.from === from) && (!to || t.to === to),
    );
    if (selected.length === 0) {
        throw new Error(
            `No known migration matches --from=${from ?? '*'} --to=${to ?? '*'}. ` +
            `Known transitions: ${TRANSITIONS.map((t) => `${t.from}->${t.to}`).join(', ')}`,
        );
    }
    return selected;
}

function main() {
    const currentDir = process.cwd();
    // Legacy convenience: running the script from inside the old docs/ (now
    // slides/) directory should still resolve the project root correctly.
    const rootDir = ['docs', 'slides'].includes(path.basename(currentDir))
        ? path.dirname(currentDir)
        : currentDir;

    const transitions = selectTransitions(process.argv.slice(2));
    for (const transition of transitions) {
        console.log(`\n=== Migration ${transition.from} -> ${transition.to} ===`);
        transition.run(rootDir);
    }

    console.log('\nMigration complete!');
    console.log('Please review the changes carefully.');
}

main();
