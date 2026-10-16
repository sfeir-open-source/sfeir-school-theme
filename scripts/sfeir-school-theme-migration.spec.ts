import {
    SEEDED_ADRS,
    ensureAdrBootstrap,
    ensureLicenses,
    runCli,
    runV3ToV4ContentMigration,
    runV4ToV5StructuralMigration,
} from './sfeir-school-theme-migration';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';

let workDir: string;
let projectDir: string;
let sources: { adrDir: string; license: string };

function write(relativePath: string, content: string, base = projectDir) {
    const target = path.join(base, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf-8');
}

function read(relativePath: string, base = projectDir) {
    return fs.readFileSync(path.join(base, relativePath), 'utf-8');
}

function exists(relativePath: string, base = projectDir) {
    return fs.existsSync(path.join(base, relativePath));
}

beforeEach(() => {
    workDir = fs.mkdtempSync(path.join(tmpdir(), 'sst-migrate-'));
    projectDir = path.join(workDir, 'project');
    fs.mkdirSync(projectDir);

    const themeDir = path.join(workDir, 'theme');
    sources = {
        adrDir: path.join(themeDir, 'adr'),
        license: path.join(themeDir, 'LICENSE'),
    };
    write('LICENSE', 'Apache License\nVersion 2.0, January 2004\n', themeDir);
    for (const name of SEEDED_ADRS) {
        write(path.join('adr', name), `# ${name}\n\nbody of ${name}\n`, themeDir);
    }

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(workDir, { recursive: true, force: true });
});

describe(ensureAdrBootstrap.name, () => {
    it('seeds the theme ADRs as-is, same name and content', () => {
        ensureAdrBootstrap(projectDir, sources.adrDir);

        expect(SEEDED_ADRS).toEqual([
            'theme-0000-adopt-adrs.md',
            'theme-0001-comply-with-theme-adrs.md',
        ]);
        for (const name of SEEDED_ADRS) {
            expect(read(path.join('docs', 'adr', name))).toBe(
                read(path.join('adr', name), path.dirname(sources.adrDir)),
            );
        }
    });

    it('does not renumber around existing school ADRs', () => {
        write('docs/adr/0000-school-decision.md', 'mine');
        write('docs/adr/xxx-0000-other.md', 'mine too');

        ensureAdrBootstrap(projectDir, sources.adrDir);

        expect(fs.readdirSync(path.join(projectDir, 'docs', 'adr')).sort()).toEqual([
            '0000-school-decision.md',
            'theme-0000-adopt-adrs.md',
            'theme-0001-comply-with-theme-adrs.md',
            'xxx-0000-other.md',
        ]);
    });

    it('never overwrites an existing file and is idempotent', () => {
        write('docs/adr/theme-0000-adopt-adrs.md', 'local edit');

        ensureAdrBootstrap(projectDir, sources.adrDir);
        ensureAdrBootstrap(projectDir, sources.adrDir);

        expect(read('docs/adr/theme-0000-adopt-adrs.md')).toBe('local edit');
        expect(fs.readdirSync(path.join(projectDir, 'docs', 'adr'))).toHaveLength(2);
    });

    it('skips a missing source without failing', () => {
        fs.rmSync(path.join(sources.adrDir, SEEDED_ADRS[1]));

        ensureAdrBootstrap(projectDir, sources.adrDir);

        expect(exists(`docs/adr/${SEEDED_ADRS[0]}`)).toBe(true);
        expect(exists(`docs/adr/${SEEDED_ADRS[1]}`)).toBe(false);
    });
});

describe(ensureLicenses.name, () => {
    it('seeds LICENSE from the theme and a CC BY-ND 4.0 LICENSE-CONTENT', () => {
        ensureLicenses(projectDir, sources.license);

        expect(read('LICENSE')).toBe(read('LICENSE', path.dirname(sources.license)));
        const content = read('LICENSE-CONTENT');
        expect(content).toContain('CC BY-ND 4.0');
        expect(content).toContain('https://creativecommons.org/licenses/by-nd/4.0/legalcode');
        expect(content).toContain('slides/');
    });

    it('never overwrites existing license files', () => {
        write('LICENSE', 'MIT');
        write('LICENSE-CONTENT', 'CC-BY 4.0');

        ensureLicenses(projectDir, sources.license);

        expect(read('LICENSE')).toBe('MIT');
        expect(read('LICENSE-CONTENT')).toBe('CC-BY 4.0');
    });

    it('treats LICENSE.md as an existing code license', () => {
        write('LICENSE.md', 'MIT');

        ensureLicenses(projectDir, sources.license);

        expect(exists('LICENSE')).toBe(false);
        expect(exists('LICENSE-CONTENT')).toBe(true);
    });
});

describe(runV4ToV5StructuralMigration.name, () => {
    it('migrates a v4 project and is idempotent', () => {
        write('docs/scripts/slides.js', 'export {}');
        write('docs/markdown/00-intro.md', '# Intro');
        write('docs/notes.md', 'moved');
        write('steps/01-lab/README.md', '# Lab');
        write('.sfeir-theme-config.json', JSON.stringify({ stepCommandPrefix: 'lab' }));

        runV4ToV5StructuralMigration(projectDir, sources);
        const firstPass = snapshot(projectDir);
        runV4ToV5StructuralMigration(projectDir, sources);

        expect(snapshot(projectDir)).toEqual(firstPass);
        expect(Object.keys(firstPass).sort()).toEqual([
            '.sfeir-theme-config.json',
            'LICENSE',
            'LICENSE-CONTENT',
            'docs/adr/theme-0000-adopt-adrs.md',
            'docs/adr/theme-0001-comply-with-theme-adrs.md',
            'labs/01-lab/README.md',
            'slides/markdown/00-intro.md',
            'slides/notes.md',
            'slides/scripts/slides.js',
        ]);
        expect(JSON.parse(firstPass['.sfeir-theme-config.json'])).toEqual({
            labCommandPrefix: 'lab',
        });
    });
});

describe(`${runV4ToV5StructuralMigration.name} with a v4 docs/LICENSE`, () => {
    beforeEach(() => {
        write('docs/index.html', 'deck');
        write('docs/LICENSE', 'Attribution-NoDerivs 3.0 Unported');
    });

    it('moves docs/LICENSE to LICENSE-CONTENT, kept as-is, never into slides/', () => {
        runV4ToV5StructuralMigration(projectDir, sources);

        expect(read('LICENSE-CONTENT')).toBe('Attribution-NoDerivs 3.0 Unported');
        expect(exists('docs/LICENSE')).toBe(false);
        expect(exists('slides/LICENSE')).toBe(false);
        expect(read('slides/index.html')).toBe('deck');
        const output = vi.mocked(console.log).mock.calls.flat().join('\n');
        expect(output).toContain('docs/LICENSE moved to LICENSE-CONTENT');
    });

    it('is idempotent', () => {
        runV4ToV5StructuralMigration(projectDir, sources);
        const firstPass = snapshot(projectDir);

        runV4ToV5StructuralMigration(projectDir, sources);

        expect(snapshot(projectDir)).toEqual(firstPass);
    });

    it('leaves both files alone and warns when LICENSE-CONTENT already exists', () => {
        write('LICENSE-CONTENT', 'CC BY-SA 4.0 chosen by the school');

        runV4ToV5StructuralMigration(projectDir, sources);

        expect(read('LICENSE-CONTENT')).toBe('CC BY-SA 4.0 chosen by the school');
        expect(read('docs/LICENSE')).toBe('Attribution-NoDerivs 3.0 Unported');
        expect(exists('slides/LICENSE')).toBe(false);
        const warnings = vi.mocked(console.warn).mock.calls.flat().join('\n');
        expect(warnings).toContain('docs/LICENSE');
        expect(warnings).toContain('LICENSE-CONTENT');
    });
});

describe(`${runV3ToV4ContentMigration.name} and docs/adr/`, () => {
    it('rewrites slide markdown but never touches docs/adr/', () => {
        write('docs/markdown/00-intro.md', '![float-left](./a.png)');
        write('docs/adr/theme-0000-adopt-adrs.md', '![diagram](./adr.png)');

        runV3ToV4ContentMigration(projectDir);

        expect(read('docs/markdown/00-intro.md')).toBe("![](./a.png 'float-left')");
        expect(read('docs/adr/theme-0000-adopt-adrs.md')).toBe('![diagram](./adr.png)');
    });
});

describe(`${runV4ToV5StructuralMigration.name} on a realistic v4 deck`, () => {
    const DECK_FILES = [
        'index.html',
        'package.json',
        'package-lock.json',
        '.nvmrc',
        'jsconfig.json',
        'scss/slides.scss',
        'markdown/00-intro.md',
        'scripts/slides.js',
        'assets/images/logo.png',
        'web_modules/sfeir-school-theme/dist/sfeir-school-theme.mjs',
    ];

    beforeEach(() => {
        for (const file of DECK_FILES) {
            write(`docs/${file}`, `content of ${file}`);
        }
        write('docs/adr/x.md', '# school ADR');
    });

    it('moves the whole deck from docs/ to slides/ and keeps docs/adr/', () => {
        runV4ToV5StructuralMigration(projectDir, sources);

        for (const file of DECK_FILES) {
            expect(read(`slides/${file}`)).toBe(`content of ${file}`);
        }
        expect(read('docs/adr/x.md')).toBe('# school ADR');
        expect(exists('slides/adr')).toBe(false);
        expect(fs.readdirSync(path.join(projectDir, 'docs'))).toEqual(['adr']);
    });

    it('is idempotent', () => {
        runV4ToV5StructuralMigration(projectDir, sources);
        const firstPass = snapshot(projectDir);

        runV4ToV5StructuralMigration(projectDir, sources);

        expect(snapshot(projectDir)).toEqual(firstPass);
    });

    it('leaves docs/ untouched when slides/ already exists', () => {
        write('slides/index.html', 'existing');
        const docsBefore = snapshot(path.join(projectDir, 'docs'));

        runV4ToV5StructuralMigration(projectDir, sources);

        expect(read('slides/index.html')).toBe('existing');
        const docsAfter = snapshot(path.join(projectDir, 'docs'));
        for (const [file, content] of Object.entries(docsBefore)) {
            expect(docsAfter[file]).toBe(content);
        }
    });
});

describe(runCli.name, () => {
    beforeEach(() => {
        write('docs/markdown/00-intro.md', '![float-left](./a.png)');
    });

    it.each([['--help'], ['-h']])('prints usage on %s, exits 0, touches nothing', (flag) => {
        const before = snapshot(projectDir);

        expect(runCli([flag], projectDir)).toBe(0);

        expect(snapshot(projectDir)).toEqual(before);
        const output = vi.mocked(console.log).mock.calls.flat().join('\n');
        expect(output).toContain('--from');
        expect(output).toContain('v4 -> v5');
    });

    it('documents that a single --from or --to selects the transitions', () => {
        runCli(['--help'], projectDir);

        const output = vi.mocked(console.log).mock.calls.flat().join('\n');
        expect(output).toContain('At least one of --from/--to is required');
        expect(output).toContain('sfeir-school-theme-migrate --to=v5');
    });

    it('runs the transition matching a single --to', () => {
        expect(runCli(['--to=v5'], projectDir)).toBe(0);

        expect(exists('slides/markdown/00-intro.md')).toBe(true);
        expect(read('slides/markdown/00-intro.md')).toBe('![float-left](./a.png)');
    });

    it('refuses to run without --from/--to (no destructive default)', () => {
        const before = snapshot(projectDir);

        expect(runCli([], projectDir)).not.toBe(0);

        expect(snapshot(projectDir)).toEqual(before);
        expect(vi.mocked(console.error).mock.calls.flat().join('\n')).toContain('--from');
    });

    it.each([['--frm=v4'], ['--from', 'v4'], ['extra']])(
        'rejects unknown argument %s with usage, exit non-zero',
        (...argv) => {
            const before = snapshot(projectDir);

            expect(runCli(argv, projectDir)).not.toBe(0);

            expect(snapshot(projectDir)).toEqual(before);
            expect(vi.mocked(console.error).mock.calls.flat().join('\n')).toContain('Usage');
        },
    );

    it('rejects an unknown transition', () => {
        expect(runCli(['--from=v1', '--to=v2'], projectDir)).not.toBe(0);
        expect(vi.mocked(console.error).mock.calls.flat().join('\n')).toContain(
            'No known migration',
        );
    });

    it('runs only the selected transition', () => {
        expect(runCli(['--from=v3', '--to=v4'], projectDir)).toBe(0);

        expect(read('docs/markdown/00-intro.md')).toBe("![](./a.png 'float-left')");
        expect(exists('slides')).toBe(false);
    });
});

function snapshot(dir: string, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const relative = path.posix.join(prefix, entry.name);
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            Object.assign(result, snapshot(full, relative));
        } else {
            result[relative] = fs.readFileSync(full, 'utf-8');
        }
    }
    return result;
}
