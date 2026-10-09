#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import path from 'path';

// #region Règles de nettoyage

const CLEANUP_RULES = {
    MARKDOWN: [
        {
            from: /<!-- \.slide:\s*-->/g,
            to: '',
        },
        {
            from: /<!-- \.slide: class="([^"]*)"/g,
            to: (match: any, classString: any) => {
                if (
                    classString.includes('transition') &&
                    classString.includes('underline')
                ) {
                    const newClassString = classString
                        .replace(/\bunderline\b/g, '')
                        .replace(/\s\s+/g, ' ')
                        .trim();
                    return `<!-- .slide: class="${newClassString}"`;
                }
                return match; // return the original match if conditions are not met
            },
        },
        {
            from: /class="([^"]*)"/g,
            to: (match: any, classString: any) => {
                if (classString.includes('bg-pink')) {
                    const newClassString = classString
                        .replace(/\bbg-pink\b/g, '')
                        .replace(/\s\s+/g, ' ')
                        .trim();
                    return `class="${newClassString}"`;
                }
                return match; // return the original match if conditions are not met
            },
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

function cleanupFile(filePath: string) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const originalContent = content;

        content = applyRules(content, CLEANUP_RULES.MARKDOWN);

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Successfully cleaned up: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error cleaning up file ${filePath}:`, error);
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

function main() {
    const currentDir = process.cwd();
    const rootDir = ['docs', 'slides'].includes(path.basename(currentDir))
        ? path.dirname(currentDir)
        : currentDir;

    const slidesDir = path.join(rootDir, 'slides');
    const legacyDocsDir = path.join(rootDir, 'docs');
    let slidesPath: string;
    if (fs.existsSync(slidesDir)) {
        slidesPath = slidesDir;
    } else if (fs.existsSync(legacyDocsDir)) {
        console.log(
            'No slides/ directory found, falling back to legacy docs/. ' +
            'Run sfeir-school-theme-migrate first to move to slides/.'
        );
        slidesPath = legacyDocsDir;
    } else {
        console.error(`Error: neither slides/ nor docs/ found under ${rootDir}`);
        return;
    }

    console.log(`Starting cleanup in: ${slidesPath}`);
    const filesToCleanup = findFiles(slidesPath, /\.md$/);

    if (filesToCleanup.length === 0) {
        console.log('No markdown files found in the slides directory.');
        return;
    }

    console.log(`Found ${filesToCleanup.length} files to clean up.`);
    filesToCleanup.forEach(cleanupFile);

    console.log('\nCleanup complete!');
    console.log('Please review the changes carefully.');
}

main();
