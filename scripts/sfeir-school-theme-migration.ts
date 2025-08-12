#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';

// #region Règles de migration

// Règles V3 -> V4 avec le bon ordre
const V3_TO_V4_RULES = {
    MARKDOWN: [
        // 1. Icônes (plus spécifique)
        {
            from: /(!\[sfeir-icons([^\\]*)\]\(([^)]+)\))<!-- \.element: style=\"([^\"]*)\" -->/g,
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
                const newStyleComment = `<!-- .element: style=\" ${newStyleContent}\" -->`;

                return newImage + newStyleComment;
            },
        },
        {
            from: /!\[sfeir-icons([^\\]*)\]\(([^)]+)\)(?!<!-- \.element: style=)/g,
            to: (_match: any, modifiers: any, iconName: any) => {
                let classes = 'tc-icons feather';
                if (modifiers.includes('small')) classes += ' tc-small';
                if (modifiers.includes('big')) classes += ' tc-big';
                return `![](${iconName} '${classes}')`;
            },
        },
        // 2. Images (plus générique)
        {
            from: /!\[([^\]]*?(?:h-|w-)[^\]]*)\]\(([^)]+)\)/g,
            to: "![]($2 '$1')",
        },
        // 3. Autres règles
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
            from: /(from\s+['"])([^'"\/]*\/sfeir-school-theme)\/sfeir-school-theme\.mjs(['"])/g,
            to: '$1$2/dist/sfeir-school-theme.mjs$3',
        },
    ],
};

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
    // Regex pour capturer les slides avec class="two-column" ou "two-column-layout"
    const slideRegex =
        /(<!-- \.slide: class=\"[^\"]*(?:two-column-layout|two-column)[^\"]*\"[^>]*-->)([\s\S]*?)(?=<!-- \.slide:|##==##|$)/g;

    return content.replace(
        slideRegex,
        (_fullMatch: any, slideTag: any, slideContent: any) => {
            console.log('Migrating a multi-column slide...');

            // Remplacer la classe dans le tag de slide - CORRECTION: tc-multiple-columns avec 's'
            const newSlideTag = slideTag.replace(
                /(?:two-column-layout|two-column)/g,
                'tc-multiple-columns'
            );

            // Séparer les Notes du contenu principal
            const notesMatch = slideContent.match(
                /(Notes:\s*[\s\S]*?)(?=##--##|<!-- \.slide:|##==##|$)/
            );
            const notes = notesMatch ? notesMatch[1].trim() : '';

            // Enlever les Notes du contenu pour traiter les colonnes
            let contentWithoutNotes = slideContent;
            if (notes) {
                contentWithoutNotes = slideContent
                    .replace(
                        /(Notes:\s*[\s\S]*?)(?=##--##|<!-- \.slide:|##==##|$)/,
                        ''
                    )
                    .trim();
            }

            // Diviser le contenu en colonnes en utilisant ##--##
            const columns = contentWithoutNotes.split(/##--##/);

            // Traiter chaque colonne
            const newColumnsContent = columns
                .map((col: any) => col.trim())
                .filter((col: any) => col.length > 0)
                .map((col: any) => `##++##\n${col}\n##++##`)
                .join('\n\n');

            // Reconstruire le slide
            let result = newSlideTag + '\n\n' + newColumnsContent;

            // Ajouter les Notes à la fin si elles existent
            if (notes) {
                result += '\n\n' + notes;
            }

            return result + '\n\n';
        }
    );
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
                ''
            );

            // Wrap in a div
            const newContent = `<div class="speaker-slide">\n${processedContent.trim()}\n</div>`;

            return `${slideTag}\n\n${newContent}\n\n`;
        }
    );
}

function migrateFile(filePath: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;
        const extension = path.extname(filePath);

        if (extension === '.md') {
            content = migrateSpeakerSlides(content); // Avant les autres règles
            content = applyRules(content, V3_TO_V4_RULES.MARKDOWN);
            content = migrateMultiColumnSlides(content);
        } else if (extension === '.html') {
            content = applyRules(content, V3_TO_V4_RULES.HTML);
        } else if (extension === '.js') {
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
        if (path.basename(fullPath) === 'web_modules') {
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

function main() {
    const currentDir = process.cwd();
    let docsPath: string;
    // Vérifier si on est dans le dossier docs ou dans la racine du projet
    if (path.basename(currentDir) === 'docs') {
        // Cas 2: le script est dans docs/, on traite le dossier courant
        docsPath = currentDir;
        console.log(
            `Script detected in docs directory. Starting migration in: ${docsPath}`
        );
    } else {
        // Cas 1: le script est à la racine, on cherche le dossier docs/
        docsPath = path.join(currentDir, 'docs');
        console.log(
            `Script detected in project root. Starting migration in: ${docsPath}`
        );
    }

    // Vérifier que le dossier docs existe
    if (!fs.existsSync(docsPath)) {
        console.error(`Error: docs directory not found at ${docsPath}`);
        return;
    }
    console.log(`Starting migration in: ${docsPath}`);
    const filesToMigrate = findFiles(docsPath, /\.(md|html|js)$/);

    if (filesToMigrate.length === 0) {
        console.log(
            'No relevant files (.md, .html, .js) found in the docs directory.'
        );
        return;
    }

    console.log(`Found ${filesToMigrate.length} files to migrate.`);
    filesToMigrate.forEach(migrateFile);

    console.log('\nMigration complete!');
    console.log('Please review the changes carefully.');
}

main();
