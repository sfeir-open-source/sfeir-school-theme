import { LabsJson, PackageJson } from './utils/labs.utils';
import { ConfigJson } from './utils/config.utils';
import { DirStruct } from './test-utils/project-builder.utils';
import fs from 'node:fs';

export function slideCssFile() {
    return `\n`;
}

export function slideJsFile(slides: string[] = []) {
    return `export function formation() { return ${JSON.stringify(
        slides
    )}.map(path => ({path})) }\n`;
}

export function packageJsonFile(content: Partial<PackageJson> = {}) {
    return JSON.stringify(content) + '\n';
}

export function labsJsonFile(content: Partial<LabsJson> = {}) {
    return JSON.stringify(content) + '\n';
}

export function configFile(content: Partial<ConfigJson> = {}) {
    return { '.sfeir-theme-config.json': JSON.stringify(content) };
}

export function contributionGuide() {
    return {
        'CONTRIBUTION_GUIDE.md': `# Contribution guide

## How to start the slides on local?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How to start a lab?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.

## How to add a new lab?

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 

Vivamus lacinia odio vitae vestibulum vestibulum. 

Cras venenatis euismod malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus. Curabitur aliquet quam id dui posuere blandit.

## What tasks to do before push a PR?

Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## What are the specific rules of this training?

Vivamus lacinia odio vitae vestibulum vestibulum. Integer nec odio.

`,
    };
}

export type SpeakerSlideOptions = {
    firstname: string;
    lastname: string;
};

export function speakerSlideFile({ firstname, lastname }: SpeakerSlideOptions) {
    return `<!-- .slide: class="speaker-slide" -->
<div class="speaker-slide">

# Hello ! @SFEIR

## ${firstname} <b>${lastname}</b>

### Developer

### fake.email@sfeir.com

</div>`;
}

export type LabSlideOptions = {
    title?: string;
    steps?: string[];
    cmd?: string;
};

export function labSlideFile({
    title = '',
    steps = [],
    cmd = '',
}: LabSlideOptions) {
    return `<!-- .slide: class="exercice" -->

# ${title}

## Lab

<br>

${steps.map((step, index) => `${index + 1}. ${step}`)}

### ${cmd}
    `;
}

export function imageFile() {
    return '';
}

export function web_modules() {
    return {
        web_modules: {
            'sfeir-school-theme': {
                dist: {
                    'sfeir-school-theme.css': sfeirSchoolThemeCssFile(),
                },
            },
        },
    };
}

export function sfeirSchoolThemeCssFile() {
    return fs.readFileSync('./dist/sfeir-school-theme.css', 'utf-8');
}

export function labReadmeMdFile(name: string, prefix = 'npm run ') {
    return `# ${name} instructions\n${prefix}${name}\n`;
}

export function labNoSolutionFile() {
    return '';
}

export function oneLabStructure(name: string, files: DirStruct) {
    return {
        [name]: {
            ...files,
        },
    };
}

export function minimalValidLabStructure(name: string, prefix?: string) {
    return {
        ...oneLabStructure(name, {
            'package.json': packageJsonFile({ name }),
            'README.md': labReadmeMdFile(name, prefix),
        }),
        ...oneLabStructure(name + '-solution', {
            'package.json': packageJsonFile({ name: name + '-solution' }),
        }),
    };
}
