import {
    CheckError,
    __TEST_ONLY__cleanupErrors,
    getErrors,
    getWarnings,
} from './utils/assert.utils';
import { beforeEach, describe, expect, it } from 'vitest';
import {
    configFile,
    contributionGuide,
    imageFile,
    labNoSolutionFile,
    labReadmeMdFile,
    labSlideFile,
    labsJsonFile,
    minimalSlidesDir,
    minimalValidLabStructure,
    oneLabStructure,
    packageJsonFile,
    slideCssFile,
    slideJsFile,
    slideJsFileWithInit,
    speakerSlideFile,
    web_modules,
} from './command-check.spec-helper';
import { buildProject } from './test-utils/project-builder.utils';
import { checkCommandInternal } from './command/check/internal';

describe('check command', () => {
    beforeEach(() => __TEST_ONLY__cleanupErrors());
    describe('valid projects', () => {
        it('minimal valid empty project', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                slides: {
                    assets: { images: {} },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {},
                    scripts: {
                        'slides.js': slideJsFile(),
                    },
                    ...web_modules(),
                },
                labs: {
                    'package.json': packageJsonFile(),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('simple project with no command prefix', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: '' }),
                ...contributionGuide(),
                slides: {
                    assets: {
                        images: {
                            'foo.png': imageFile(),
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-getting-started.md': '![](./assets/images/foo.png)',
                        '99-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'Go to 001-getting-started-lab',
                        }),
                        '100-lab-no-command.md': `<!-- .slide: class="exercice" -->

# 002-no-command-lab

## Lab

<br>

### 002-no-command-lab
    `,
                        '101-lab-not-existing-command.md': `<!-- .slide: class="exercice" -->

# Lab with no command

## Lab

<br>

### no command to executre
    `,
                    },
                    scripts: {
                        'slides.js': slideJsFile([
                            '01-getting-started.md',
                            '99-lab-getting-started.md',
                            '100-lab-no-command.md',
                            '101-lab-not-existing-command.md',
                        ]),
                    },
                    ...web_modules(),
                },
                labs: {
                    'labs.json': labsJsonFile({
                        labs: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                            '002-no-command-lab',
                        ],
                    }),
                    '001-getting-started-lab': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                    },
                    '001-getting-started-lab-solution': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                    },
                    '002-no-command-lab': {
                        'README.md': `# 002-no-command-lab instructions\n\nReadme with no command`,
                        '.nosolution': labNoSolutionFile(),
                    },
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });

            expect(getErrors()).toStrictEqual([]);
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('simple npm project with workspace', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                slides: {
                    assets: {
                        images: {
                            'foo.png': imageFile(),
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-getting-started.md': '![](./assets/images/foo.png)',
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile([
                            '01-getting-started.md',
                            '01-lab-getting-started.md',
                        ]),
                    },
                    ...web_modules(),
                },
                labs: {
                    ...minimalValidLabStructure('001-getting-started-lab'),
                    'package.json': packageJsonFile({
                        workspaces: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('simple npm project without workspace', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                slides: {
                    assets: { images: {} },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile(['01-lab-getting-started.md']),
                    },
                    ...web_modules(),
                },
                labs: {
                    ...minimalValidLabStructure('001-getting-started-lab'),
                    'package.json': packageJsonFile({
                        workspaces: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('npm project with command prefix override', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'yarn run ' }),
                ...contributionGuide(),
                slides: {
                    assets: { images: {} },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'yarn run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile(['01-lab-getting-started.md']),
                    },
                    ...web_modules(),
                },
                labs: {
                    ...minimalValidLabStructure(
                        '001-getting-started-lab',
                        'yarn run '
                    ),
                    'package.json': packageJsonFile({
                        workspaces: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });
        it('lab with .nosolution file could not have a solution -> exception for [L_008]', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                slides: {
                    assets: {
                        images: {
                            'foo.png': imageFile(),
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-getting-started.md': '![](./assets/images/foo.png)',
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile([
                            '01-getting-started.md',
                            '01-lab-getting-started.md',
                        ]),
                    },
                    ...web_modules(),
                },
                labs: {
                    ...oneLabStructure('001-getting-started-lab', {
                        'package.json': packageJsonFile({
                            name: '001-getting-started-lab',
                        }),
                        'README.md': labReadmeMdFile('001-getting-started-lab'),
                        '.nosolution': labNoSolutionFile(),
                    }),
                    'package.json': packageJsonFile({
                        workspaces: ['001-getting-started-lab'],
                        scripts: {
                            '001-getting-started-lab': '',
                        },
                    }),
                },
            });
            try {
                await checkCommandInternal({ type: 'check', rootDir });
            } catch (err) {
                console.error(err);
            }

            expect(getErrors()).toHaveLength(0);
        });

        it('Slides with images', async () => {
            const rootDir = buildProject({
                ...contributionGuide(),
                slides: {
                    assets: {
                        images: {
                            'bg.png': imageFile(),
                            'intro.png': imageFile(),
                            'logo-sfeir-blanc.png': imageFile(),
                            'foo2.png': imageFile(),
                            'foo3.png': imageFile(),
                            'foo4.png': imageFile(),
                            'foo5.png': imageFile(),
                            'foo6.png': imageFile(),
                            speakers: {
                                'CMA.jpg': imageFile(),
                                'the-conf.svg': imageFile(),
                            },
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '00-speaker-cma.md': `
<!-- .slide: class="speaker-slide" -->

<div class="speaker-slide">

# Présentation

![](./assets/images/speakers/CMA.jpg 'speaker')

![](./assets/images/speakers/the-conf.svg 'badge')

![](./assets/images/logo-sfeir-blanc.png 'company')

## Claire MARTIN

### Ingénieure DevOps & Cloud

### @ClaireDevOps

### martin.c@sfeir.com

</div>`,
                        '01-getting-started.md': `
# Getting started

![](./assets/images/intro.png)
                        `,
                        '02-html-images.md':
                            '<!-- .slide: data-background="./assets/images/bg.png"  -->\n' +
                            '<img src="./assets/images/foo2.png"/>\n' +
                            '<img class="tc-bg" src="./assets/images/foo3.png"/>\n' +
                            '<div>\n' +
                            '    <img src="./assets/images/foo4.png" />\n' +
                            '</div>\n' +
                            '<img src="./assets/images/foo5.png"/><img src="./assets/images/foo6.png"/>\n',
                    },
                    scripts: {
                        'slides.js': slideJsFile([
                            '00-speaker-cma.md',
                            '01-getting-started.md',
                            '02-html-images.md',
                        ]),
                    },
                    ...web_modules(),
                },
                labs: {
                    'package.json': packageJsonFile({}),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('should ignore hidden files', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                '.DS_Store': '',
                'Thumbs.db': '',
                slides: {
                    '.DS_Store': '',
                    'Thumbs.db': '',
                    assets: {
                        '.DS_Store': '',
                        'Thumbs.db': '',
                        images: {
                            '.hidden-image.png': imageFile(),
                            '.DS_Store': '',
                            'Thumbs.db': '',
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '.hidden-slide.md': '',
                        'Thumbs.db': '',
                        '.DS_Store': '',
                    },
                    scripts: {
                        'slides.js': slideJsFile(),
                    },
                    ...web_modules(),
                },
                labs: {
                    '.DS_Store': '',
                    'Thumbs.db': '',
                    '.hidden-slide.md': '',
                    'package.json': packageJsonFile(),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it('project with ignored labs', async () => {
            const rootDir = buildProject({
                ...configFile({ ignoreLabsDirectories: ['common'] }),
                ...contributionGuide(),
                slides: {
                    assets: { images: {} },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile(['01-lab-getting-started.md']),
                    },
                    ...web_modules(),
                },
                labs: {
                    common: {
                        'index.ts': "export function foo() { return 'foo'; }",
                        'package.json': packageJsonFile({ name: 'common' }),
                    },
                    '001-getting-started-lab': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                        'package.json': packageJsonFile({
                            name: '001-getting-started-lab',
                        }),
                    },
                    '001-getting-started-lab-solution': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                        'package.json': packageJsonFile({
                            name: '001-getting-started-lab-solution',
                        }),
                    },
                    'package.json': packageJsonFile({
                        workspaces: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toStrictEqual([]);
            expect(getErrors()).toHaveLength(0);
        });

        it('project with ignored labs in the workspace', async () => {
            const rootDir = buildProject({
                ...configFile({ ignoreLabsDirectories: ['common'] }),
                ...contributionGuide(),
                slides: {
                    assets: { images: {} },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile(['01-lab-getting-started.md']),
                    },
                    ...web_modules(),
                },
                labs: {
                    common: {
                        'index.ts': "export function foo() { return 'foo'; }",
                        'package.json': packageJsonFile({ name: 'common' }),
                    },
                    '001-getting-started-lab': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                        'package.json': packageJsonFile({
                            name: '001-getting-started-lab',
                        }),
                    },
                    '001-getting-started-lab-solution': {
                        'README.md': labReadmeMdFile(
                            '001-getting-started-lab',
                            ''
                        ),
                        'package.json': packageJsonFile({
                            name: '001-getting-started-lab-solution',
                        }),
                    },
                    'package.json': packageJsonFile({
                        workspaces: [
                            'common',
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toStrictEqual([]);
            expect(getErrors()).toHaveLength(0);
        });

        it('lab slide without command but listed in ignoreCommandCheck [S_005][S_011]', async () => {
            const rootDir = buildProject({
                ...configFile({
                    labCommandPrefix: 'npm run ',
                    ignoreCommandCheck: ['01-lab-getting-started-bis.md'],
                }),
                ...contributionGuide(),
                slides: {
                    assets: {
                        images: {
                            'foo.png': imageFile(),
                        },
                    },
                    css: {
                        'slides.css': slideCssFile(),
                    },
                    markdown: {
                        '01-getting-started.md': '![](./assets/images/foo.png)',
                        '01-lab-getting-started.md': labSlideFile({
                            title: 'Getting started',
                            cmd: 'npm run 001-getting-started-lab',
                        }),
                        '01-lab-getting-started-bis.md': labSlideFile({
                            title: 'Getting started bis',
                            cmd: '',
                        }),
                    },
                    scripts: {
                        'slides.js': slideJsFile([
                            '01-getting-started.md',
                            '01-lab-getting-started.md',
                            '01-lab-getting-started-bis.md',
                        ]),
                    },
                    ...web_modules(),
                },
                labs: {
                    ...minimalValidLabStructure('001-getting-started-lab'),
                    'package.json': packageJsonFile({
                        workspaces: [
                            '001-getting-started-lab',
                            '001-getting-started-lab-solution',
                        ],
                        scripts: {
                            '001-getting-started-lab': '',
                            '001-getting-started-lab-solution': '',
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });
            console.error(getErrors());
            expect(getErrors()).toStrictEqual([]);
            expect(getErrors()).toHaveLength(0);
        });
        it('project without labs directory', async () => {
            const rootDir = buildProject({
                ...configFile({ labCommandPrefix: 'npm run ' }),
                ...contributionGuide(),
                slides: minimalSlidesDir({
                    markdown: { '01-intro.md': '# Intro' },
                }),
            });

            await checkCommandInternal({ type: 'check', rootDir });

            expect(getErrors()).toStrictEqual([]);
            expect(getWarnings()).toStrictEqual([]);
        });

        it('slides.js with multi-line init() and knowStyles [S_009][S_010]', async () => {
            const rootDir = buildProject({
                ...contributionGuide(),
                slides: minimalSlidesDir({
                    images: { 'logo.png': imageFile() },
                    css: '.my-logo { width: 10px; }\n',
                    markdown: {
                        '01-intro.md':
                            '<!-- .slide: class="transition-bg-blue-3" -->\n' +
                            "![](./assets/images/logo.png 'my-logo h-50 company')\n",
                    },
                    slidesJs: slideJsFileWithInit(['01-intro.md'], ['my-logo']),
                }),
            });

            await checkCommandInternal({ type: 'check', rootDir });

            expect(getErrors()).toStrictEqual([]);
        });

        it('lab whose name contains "solution" is paired with its solution [L_009]', async () => {
            const rootDir = buildProject({
                ...contributionGuide(),
                slides: minimalSlidesDir({
                    markdown: {
                        '01-lab-solution-design.md': labSlideFile({
                            title: 'Solution design',
                            cmd: '001-solution-design-lab',
                        }),
                    },
                }),
                labs: {
                    'labs.json': labsJsonFile({
                        labs: [
                            '001-solution-design-lab',
                            '001-solution-design-lab-solution',
                        ],
                    }),
                    '001-solution-design-lab': {
                        'README.md': labReadmeMdFile(
                            '001-solution-design-lab',
                            ''
                        ),
                    },
                    '001-solution-design-lab-solution': {},
                },
            });

            await checkCommandInternal({ type: 'check', rootDir });

            expect(getErrors()).toStrictEqual([]);
        });
    });

    describe('invalid projects', () => {
        describe('Global checks', () => {
            it('missing rootDir [G_001]', async () => {
                try {
                    await checkCommandInternal({
                        type: 'check',
                        rootDir: `./foo-${crypto.randomUUID()}`,
                    });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] G_001 Project root dir \(\.\/foo-.*\) does not exist\./;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('missing slides dir [G_002]', async () => {
                const rootDir = buildProject({
                    labs: {
                        'package.json': packageJsonFile(),
                    },
                });

                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] G_002 Project should have a 'slides' directory/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('legacy deck in docs/ without slides/ points to the migration [G_002]', async () => {
                const rootDir = buildProject({
                    docs: {
                        markdown: { '00-intro.md': '# Intro' },
                        scripts: { 'slides.js': slideJsFile(['00-intro.md']) },
                    },
                    steps: {
                        'package.json': packageJsonFile(),
                    },
                });

                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] G_002 Project should have a 'slides' directory: 'docs' still holds a legacy slide deck, run "npx sfeir-school-theme-migrate --from=v4 --to=v5" \(a v3 school runs "--from=v3 --to=v4" first\)/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('unknown keys in .sfeir-theme-config.json [G_005]', async () => {
                const rootDir = buildProject({
                    ...configFile({
                        labCommandPrefix: 'npm run ',
                        stepCommandPrefix: 'npm run ',
                        foo: true,
                    }),
                    ...contributionGuide(),
                    slides: minimalSlidesDir(),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                expect(getErrors()).toHaveLength(0);
                const reg1 =
                    /\[CheckWarning\] G_005 Unknown key "stepCommandPrefix" in '.sfeir-theme-config.json' \(renamed "labCommandPrefix", run "npx sfeir-school-theme-migrate --from=v4 --to=v5"\)/;
                expectMatching(getWarnings(), reg1).toHaveLength(1);
                const reg2 =
                    /\[CheckWarning\] G_005 Unknown key "foo" in '.sfeir-theme-config.json' \(it is ignored\)/;
                expectMatching(getWarnings(), reg2).toHaveLength(1);
                expect(getWarnings()).toHaveLength(2);
            });
            it('prototype-named keys are unknown, with no garbage hint [G_005]', async () => {
                const rootDir = buildProject({
                    '.sfeir-theme-config.json':
                        '{"constructor": 1, "__proto__": 2, "toString": 3}',
                    ...contributionGuide(),
                    slides: minimalSlidesDir(),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                expect(getErrors()).toHaveLength(0);
                for (const key of ['constructor', '__proto__', 'toString']) {
                    const reg = new RegExp(
                        `\\[CheckWarning\\] G_005 Unknown key "${key}" in '.sfeir-theme-config.json' \\(it is ignored\\)`
                    );
                    expectMatching(getWarnings(), reg).toHaveLength(1);
                }
                expect(getWarnings()).toHaveLength(3);
            });
            it('missing CONTRIBUTION_GUIDE.md [G_004]', async () => {
                const rootDir = buildProject({
                    slides: {
                        assets: { images: {} },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {},
                        scripts: {
                            'slides.js': slideJsFile(),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        'package.json': packageJsonFile(),
                    },
                });

                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                expect(getErrors()).toHaveLength(0);
                const reg =
                    /\[CheckWarning\] G_004 Project should have a 'CONTRIBUTION_GUIDE.md' or 'CONTRIBUTING.md' file/;
                expectMatching(getWarnings(), reg).toHaveLength(1);
                expect(getWarnings()).toHaveLength(1);
            });
            it('CONTRIBUTING.md is an accepted contribution guide [G_004]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide('CONTRIBUTING.md'),
                    slides: minimalSlidesDir(),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                expect(getErrors()).toHaveLength(0);
                expect(getWarnings()).toHaveLength(0);
            });
            it('CONTRIBUTING.md sections are checked too [G_004]', async () => {
                const rootDir = buildProject({
                    'CONTRIBUTING.md':
                        '# Contributing\n\n## How to start a lab?\n\nRun it.\n',
                    slides: minimalSlidesDir(),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                const reg =
                    /\[CheckWarning\] G_004 The 'CONTRIBUTING.md' file should contains required sections \("How to start the slides on local\?" is missing\)/;
                expectMatching(getWarnings(), reg).toHaveLength(1);
                expect(getWarnings()).toHaveLength(1);
            });
            it('missing CONTRIBUTION_GUIDE.md sections [G_004]', async () => {
                const rootDir = buildProject({
                    slides: {
                        assets: { images: {} },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {},
                        scripts: {
                            'slides.js': slideJsFile(),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        'package.json': packageJsonFile(),
                    },
                    'CONTRIBUTION_GUIDE.md': `# Contribution guide

## How to start the slides on local?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

`,
                });

                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                expect(getErrors()).toHaveLength(0);
                const reg =
                    /\[CheckWarning\] G_004 The 'CONTRIBUTION_GUIDE.md' file should contains required sections \("How to start a lab\?" is missing\)/;
                expectMatching(getWarnings(), reg).toHaveLength(1);
                expect(getWarnings()).toHaveLength(1);
            });
            it('missing CONTRIBUTION_GUIDE.md section content [G_004]', async () => {
                const rootDir = buildProject({
                    slides: {
                        assets: { images: {} },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {},
                        scripts: {
                            'slides.js': slideJsFile(),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        'package.json': packageJsonFile(),
                    },
                    'CONTRIBUTION_GUIDE.md': `# Contribution guide

## How to start the slides on local?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How to start a lab?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.

## How to add a new lab?

## What tasks to do before push a PR?

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## What are the specific rules of this training?

Vivamus lacinia odio vitae vestibulum vestibulum. Integer nec odio.

`,
                });

                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                expect(getErrors()).toHaveLength(0);
                const reg =
                    /\[CheckWarning\] G_004 All section in the 'CONTRIBUTION_GUIDE.md' file should contains information/;
                expectMatching(getWarnings(), reg).toHaveLength(1);
                expect(getWarnings()).toHaveLength(1);
            });
        });

        describe('Slides checks', () => {
            it('invalid slides.js entry [S_001]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': `export function formation() { return ['01-getting-started.md'] }\n`,
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: ['001-getting-started-lab'],
                            scripts: {
                                '001-getting-started-lab': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_001 slides.js entry ""01-getting-started.md"" should be a valid entry/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('not existing markdown file in slides.js [S_002]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                                '02-not-existing-file.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_002 slides.js entry "02-not-existing-file.md" does not match an existing file/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('not declared in slides.js markdown file [S_003]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '00-1-doe-jane.md': speakerSlideFile({
                                firstname: 'Jane',
                                lastname: 'doe',
                            }),
                            '00-2-doe-john.md': speakerSlideFile({
                                firstname: 'John',
                                lastname: 'doe',
                            }),
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                            '02-not-existing-file.md': '',
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '00-1-doe-jane.md',
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regS003Error =
                    /\[CheckError\] S_003 "02-not-existing-file.md" should be used/;
                expectMatching(getErrors(), regS003Error).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
                const regS003Warning =
                    /\[CheckWarning\] S_003 "00-2-doe-john.md" should be used/;
                expectMatching(getWarnings(), regS003Warning).toHaveLength(1);
                expect(getWarnings()).toHaveLength(1);
            });
            it('lab slide without command [S_005]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                            '01-lab-getting-started-bis.md': labSlideFile({
                                title: 'Getting started bis',
                                cmd: '',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                                '01-lab-getting-started-bis.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_005 "01-lab-getting-started-bis.md" should contains the command to run the exercise/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('lab slide without a valid command [S_005][S_011]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                            '01-lab-getting-started-bis.md': labSlideFile({
                                title: 'Getting started bis',
                                cmd: 'npm run 01-getting-starte',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                                '01-lab-getting-started-bis.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regS005 =
                    /\[CheckError\] S_005 "01-lab-getting-started-bis.md" should contains the valid command to run the exercise/;
                expectMatching(getErrors(), regS005).toHaveLength(1);
                const regS011 =
                    /\[CheckError\] S_011 "01-lab-getting-started-bis.md" lab should have a dedicated directory in `labs`/;
                expectMatching(getErrors(), regS011).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it('lab slide without a valid command [S_006]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                            '01-lab-getting-started-bis.md':
                                '# Getting started\n\nnpm run 001-getting-started-lab',
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                                '01-lab-getting-started-bis.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_006 "01-lab-getting-started-bis.md" should use lab slide format/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('slide should contains existing image [S_007]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)\n![](./assets/images/foo2.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_007 ".*\/slides\/assets\/images\/foo2.png" in "01-getting-started.md" should be an existing images/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });

            it('images in asset should be used [S_008]', async () => {
                const rootDir = buildProject({
                    ...configFile({
                        labCommandPrefix: 'npm run ',
                        ignoreAssets: ['images/ignored.png'],
                    }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                                'foo2.png': imageFile(),
                                'ignored.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_008 ".*\/slides\/assets\/images\/foo2.png" should be used/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('slide should only used existing css classes [S_009]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)\n<!-- .class="any-undefined-class" -->\n' +
                                "![](./assets/images/foo.png 'another-undefined-class')\n",
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_009 "any-undefined-class" in "01-getting-started.md" is not a known css class/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                const reg2 =
                    /\[CheckError\] S_009 "another-undefined-class" in "01-getting-started.md" is not registered in the "knowStyles" of slides.js/;
                expectMatching(getErrors(), reg2).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it('image title words should be registered talk-control styles [S_009]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: minimalSlidesDir({
                        images: { 'logo.png': imageFile() },
                        css: '.my-logo { width: 10px; }\n',
                        markdown: {
                            '01-intro.md':
                                "![](./assets/images/logo.png 'my-logo company')\n",
                        },
                        slidesJs: slideJsFileWithInit(['01-intro.md']),
                    }),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                const reg =
                    /\[CheckError\] S_009 "my-logo" in "01-intro.md" is not registered in the "knowStyles" of slides.js \(talk-control renders it as a title, not a class\)/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('registered image styles should still be defined in css [S_009]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: minimalSlidesDir({
                        images: { 'logo.png': imageFile() },
                        markdown: {
                            '01-intro.md':
                                "![](./assets/images/logo.png 'my-logo')\n",
                        },
                        slidesJs: slideJsFileWithInit(
                            ['01-intro.md'],
                            ['my-logo']
                        ),
                    }),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                const reg =
                    /\[CheckError\] S_009 "my-logo" in "01-intro.md" is not a known css class/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('css classes should match exactly, not as a substring [S_009]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: minimalSlidesDir({
                        markdown: {
                            '01-intro.md':
                                '<!-- .slide: class="with-cod  bg" -->\n# Intro\n',
                        },
                    }),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                const reg1 =
                    /\[CheckError\] S_009 "with-cod" in "01-intro.md" is not a known css class/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                const reg2 =
                    /\[CheckError\] S_009 "bg" in "01-intro.md" is not a known css class/;
                expectMatching(getErrors(), reg2).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it('talk-control icon and QR code titles are classes [S_009]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: minimalSlidesDir({
                        markdown: {
                            '01-intro.md': [
                                "![](clock 'tc-icons feather tc-big')",
                                "![](github 'tc-icons fa fa-brands')",
                                "![](https://sfeir.com 'tc-qrcode')",
                                "![](clock 'tc-icons feather tc-bigg')",
                                '',
                            ].join('\n'),
                        },
                        slidesJs: slideJsFileWithInit(['01-intro.md']),
                    }),
                });

                await checkCommandInternal({ type: 'check', rootDir });

                const reg =
                    /\[CheckError\] S_009 "tc-bigg" in "01-intro.md" is not a known css class/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('slide.js should exists [S_010]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md': '',
                        },
                        scripts: {},
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_010 slides.js should export "formation" function/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('slide.js should have exported formation function [S_010]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md': '',
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]).replaceAll('export', ''),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_010 slides.js should export "formation" function/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
        });
        describe('Labs checks', () => {
            it('labs not used in slide [L_001]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        ...minimalValidLabStructure('002-next-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                                '002-next-lab',
                                '002-next-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                                '002-next-lab': '',
                                '002-next-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_001 "002-next-lab" should be used in a lab slide/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('labs not declared in workspace [L_002][L_003]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...minimalValidLabStructure('001-getting-started-lab'),
                        ...minimalValidLabStructure('002-next-lab'),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL002 =
                    /\[CheckError\] L_002 Lab "002-next-lab" should be declared in the workspace \(either "workspaces" or "labs" in a file "package.json" or "labs.json" at the root of "labs" directory\)/;
                expectMatching(getErrors(), regL002).toHaveLength(1);
                const regL003 =
                    /\[CheckError\] L_003 Lab "002-next-lab" should have corresponding script/;
                expectMatching(getErrors(), regL003).toHaveLength(1);
                const regL002Sol =
                    /\[CheckError\] L_002 Lab "002-next-lab-solution" should be declared in the workspace \(either "workspaces" or "labs" in a file "package.json" or "labs.json" at the root of "labs" directory\)/;
                expectMatching(getErrors(), regL002Sol).toHaveLength(1);
                const regL003Sol =
                    /\[CheckError\] L_003 Lab "002-next-lab-solution" should have corresponding script/;
                expectMatching(getErrors(), regL003Sol).toHaveLength(1);
                expect(getErrors()).toHaveLength(4);
            });
            it('labs in workspace but without package.json [L_004]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_004 Lab "001-getting-started-lab" should have a package.json with corresponding name/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('labs without README.md [L_005][L_010]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            // "README.md": labReadmeMdFile("001-getting-started-lab"),
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL005 =
                    /\[CheckError\] L_005 Lab "001-getting-started-lab" should have a README.md/;
                expectMatching(getErrors(), regL005).toHaveLength(1);
                const regL010 =
                    /\[CheckError\] L_010 Lab and solution of "001-getting-started-lab" should have same README.md/;
                expectMatching(getErrors(), regL010).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it('labs with README.md missing some infos [L_006]', async () => {
                const rootDir = buildProject({
                    ...configFile({}),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: '001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            'README.md': '# 001-getting-started-lab\n',
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': '# 001-getting-started-lab\n',
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL006 =
                    /\[CheckError\] L_006 Lab "001-getting-started-lab"'s README.md should contains the correct title/;
                expectMatching(getErrors(), regL006).toHaveLength(1);
            });
            it('labs with README.md missing some infos [L_006][L_007]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            'README.md': '# 001-getting-started-lab\n',
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': '# 001-getting-started-lab\n',
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL006 =
                    /\[CheckError\] L_006 Lab "001-getting-started-lab"'s README.md should contains the correct title/;
                expectMatching(getErrors(), regL006).toHaveLength(1);
                const regL007 =
                    /\[CheckError\] L_007 Lab "001-getting-started-lab"'s README.md should contains the correct command/;
                expectMatching(getErrors(), regL007).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it('every lab should have a solution [L_008]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_008 Lab "001-getting-started-lab" should have a solution/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('every lab with .nosolution file should not have a solution [L_008]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                            '.nosolution': labNoSolutionFile(),
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_008 Lab "001-getting-started-lab" should not have both solution and `.nosolution` file/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('lab solution should match a lab [L_009]', async () => {
                const rootDir = buildProject({
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                        },
                        scripts: {
                            'slides.js': slideJsFile(['01-getting-started.md']),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: ['001-getting-started-lab-solution'],
                            scripts: {
                                '001-getting-started-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_009 Solution lab "001-getting-started-lab-solution" should match to a lab/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('lab and solution should have same README.md (if lab has a README.md) [L_010]', async () => {
                const rootDir = buildProject({
                    ...configFile({ labCommandPrefix: 'npm run ' }),
                    ...contributionGuide(),
                    slides: {
                        assets: {
                            images: {
                                'foo.png': imageFile(),
                            },
                        },
                        css: {
                            'slides.css': slideCssFile(),
                        },
                        markdown: {
                            '01-getting-started.md':
                                '![](./assets/images/foo.png)',
                            '01-lab-getting-started.md': labSlideFile({
                                title: 'Getting started',
                                cmd: 'npm run 001-getting-started-lab',
                            }),
                            '02-next.md': labSlideFile({
                                title: 'Next',
                                cmd: 'npm run 002-next-lab',
                            }),
                        },
                        scripts: {
                            'slides.js': slideJsFile([
                                '01-getting-started.md',
                                '01-lab-getting-started.md',
                                '02-next.md',
                            ]),
                        },
                        ...web_modules(),
                    },
                    labs: {
                        ...oneLabStructure('001-getting-started-lab', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab',
                            }),
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab'
                            ),
                        }),
                        ...oneLabStructure('001-getting-started-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '001-getting-started-lab-solution',
                            }),
                            'README.md':
                                labReadmeMdFile('001-getting-started-lab') +
                                '\nHello\n',
                        }),
                        ...oneLabStructure('002-next-lab', {
                            'package.json': packageJsonFile({
                                name: '002-next-lab',
                            }),
                            'README.md': labReadmeMdFile('002-next-lab'),
                        }),
                        ...oneLabStructure('002-next-lab-solution', {
                            'package.json': packageJsonFile({
                                name: '002-next-lab-solution',
                            }),
                        }),
                        'package.json': packageJsonFile({
                            workspaces: [
                                '001-getting-started-lab',
                                '001-getting-started-lab-solution',
                                '002-next-lab',
                                '002-next-lab-solution',
                            ],
                            scripts: {
                                '001-getting-started-lab': '',
                                '001-getting-started-lab-solution': '',
                                '002-next-lab': '',
                                '002-next-lab-solution': '',
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: 'check', rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_010 Lab and solution of "001-getting-started-lab" should have same README.md/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it('lab directories should be named NNN-name-lab[-solution] [L_011]', async () => {
                const labs = [
                    '01-getting-started',
                    '01-getting-started-solution',
                    '001-Getting-lab',
                    '001-getting-started-lab',
                    '001-getting-started-lab-solution',
                ];
                const rootDir = buildProject({
                    ...configFile({ ignoreLabsDirectories: ['common'] }),
                    ...contributionGuide(),
                    slides: minimalSlidesDir({
                        markdown: {
                            '99-lab-all.md': labSlideFile({
                                title: 'All labs',
                                steps: labs,
                                cmd: '001-getting-started-lab',
                            }),
                        },
                    }),
                    labs: {
                        'labs.json': labsJsonFile({ labs }),
                        common: { 'index.js': '' },
                        '01-getting-started': {
                            'README.md': labReadmeMdFile(
                                '01-getting-started',
                                ''
                            ),
                        },
                        '01-getting-started-solution': {},
                        '001-Getting-lab': {
                            'README.md': labReadmeMdFile('001-Getting-lab', ''),
                            '.nosolution': labNoSolutionFile(),
                        },
                        '001-getting-started-lab': {
                            'README.md': labReadmeMdFile(
                                '001-getting-started-lab',
                                ''
                            ),
                        },
                        '001-getting-started-lab-solution': {},
                    },
                });

                await checkCommandInternal({ type: 'check', rootDir });

                for (const lab of [
                    '01-getting-started',
                    '01-getting-started-solution',
                    '001-Getting-lab',
                ]) {
                    const reg = new RegExp(
                        `\\[CheckError\\] L_011 Lab directory "${lab}" should be named "NNN-name-lab" or "NNN-name-lab-solution"`
                    );
                    expectMatching(getErrors(), reg).toHaveLength(1);
                }
                expect(getErrors()).toHaveLength(3);
            });
        });
    });
});

function expectMatching(errors: CheckError[], expected: RegExp) {
    const messages = errors.map((err) => err.message);
    return expect(
        messages.filter((err) => err.match(expected) !== null),
        JSON.stringify(messages, undefined, 2)
    );
}
