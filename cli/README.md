# CLI

The Sfeir School Theme CLI will provide you better Sfeir School Theme experience:

- Check classes and markdown syntax;
- Images check;
- Slide declaration check;
- Labs declaration check;
- Ensure some convention;

The ultimate goals of the CLI are:

- Avoid a lot a friction when build training with the Sfeir School Theme;
- Ensure the training stay cleaned up (no old image, no unused markdown files, etc.);
- Ensure a minimal coherence between training, so when you go on another training you will not be lost;

## Installation

Add to the `docs/package.json`:

```JSON
{
    ...
    "scripts": {
        ...
        "test": "sfeir-school-theme check --rootDir=..",
        ...
    }
    ...
}
```

Add the pipeline `.github/workflows/check-repo.yml`:

```Yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check-repo:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./docs
    permissions: write-all
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20.9
      - name: Install dependencies
        run: npm ci
      - name: Unit Tests
        run: npm test

```

Init the configuration file (on the training root directory):

```Bash
npx sfeir-school-theme init-config
```

This command will create `.sfeir-theme-config.json` file.

## Basic usage

### Check the Training

```Bash
# In the training root directory:
npx sfeir-school-theme check

# From other directory:
npx sfeir-school-theme check --rootDir=path/to/training/root/directory
```

If everything is good, you should see:

```
OK
```

If there is errors:

```
[CheckError] S_003 "00-school/00-TITLE.md" should be used

You can call "sfeir-school-theme explain S_003" to have more details.
```

Every error will have a rule code `<ONE_LETTER>_<RULE_ID>` (in the above example: `S_003`).

### Explain

The CLI let you get the documentation directly:

```Bash
npx sfeir-school-theme explain S_003
```

### Get school info

This command will give you the lab list

```Bash
npx sfeir-school-theme info
```

```
# Labs

 - 01-ouverture-de-l-usine(-solution)
 - 02-preparer-la-pate(-solution)
 - 03-preparer-les-pommes(-solution)
 - 04-foncer-la-tarte(-solution)
 - 05-cuire-la-tarte(-solution)
 - 06-tests(-solution)
 - 99-bonus-simple-mapping(-solution)
 - 100-bonus-chevre-chaud(-solution)
```

### Get school theme version

This command will give you the lab list

```Bash
npx sfeir-school-theme version
```

```
Version: 4.0.0-rc-14
```

## Configuration files

### extraCssFiles: string[] (optional)

Default: `[]`

You can specify here training css files. If you defined new css classes, these classes will be considered for S_009.

### stepCommandPrefix: string (optional)

Default: `""`

If you specify `stepCommandPrefix`, every command of the training will be excepted to start with this prefix.

For example, if you defined `"stepCommandPrefix": "npm run "`, your lab slide should look like:

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab

...

### npm run lab-name
```

### ignoreStepsDirectories: string[] (optional)

Default: `[]`

You can specify here every directories which are not lab but need to be in the `steps` directory (node_modules, common modules, data, etc.)

### ignoreAssets: string[] (optional)

Default: `[]`

Every assets here will be ignored. So S_008 will not emit any warning or error.

## Rules

### Global checks

##### G_001 the root directory exists (current working dir by default, --rootDir value if specified)

To make the sfeir-school-theme CLI work correctly, it should be run in the repository root (or be run with --rootDir specified), and the root directory should exists.

##### G_002 the `<root>/docs` directory exists

The root directory should contains a minimal structure:

```
<root>
├── CONTRIBUTING.md
├── docs
|   ├── ...
├── LICENSE
├── README.md
└── steps
    ├── ...
```

##### G_003 the `<root>/steps` directory exists

The root directory should contains a minimal structure:

```
<root>
├── CONTRIBUTING.md
├── docs
|   ├── ...
├── LICENSE
├── README.md
└── steps
    ├── ...
```

##### G_004 the `<root>/CONTRIBUTION-GUIDE.md` file should exists and contains required content

To ensure every trainer to be able to work smoothly on any training, a file `<root>/CONTRIBUTION-GUIDE.md` should be present and contains required sections.

The required sections are:

- How to start the slides on local?
- How to start a lab?
- How to add a new lab?
- What tasks to do before push a PR?
- What are the specific rules of this training?

### Slides checks

#### General slides checks

##### S_010 the script `<root>/docs/scripts/slides.js` should contain an exported function `formation()`

Every school should have a file `slides.js` in the correct directory and with an exported function `formation()`.

`<root>/docs/scripts/slides.js` :

```JavaScript
import { SfeirThemeInitializer } from '../web_modules/sfeir-school-theme/dist/sfeir-school-theme.mjs';

function schoolSlides() {
  const dir = '00-school';
  return [
    `${dir}/00-TITLE.md`,
    `${dir}/01-wifi.md`,
    ...
  ];
}

...

export function formation() {
  return [
    schoolSlides(),
    ...
  ].flatMap((slidePath) => ({ path: slidePath }));
}

SfeirThemeInitializer.init(formation);
```

##### S_001 every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` is valid

Every entry returned by the function `formation()` should be an object which have a path property.

##### S_002 every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` exists in the `<root>/docs/markdown` directory

Every entry returned by the function `formation()` should have a path matching an existing markdown file in the `<root>/docs/markdown` directory.

##### S_003 every markdown file in the `<root>/docs/markdown` directory is declared in the `<root>/docs/scripts/slides.js`

Every markdown files in the `<root>/docs/markdown` directory should be declared with a valid entry in the result of the `formation()` function in `<root>/docs/scripts/slides.js`.

#### Lab slides specific checks

##### S_005 every lab slide file contains the valid command to run the exercise

Every labs should have the expected format:

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab

<br>

1. First thing to do
2. Another thing to do
3. Last thing to do

<br>

- note for the students

### command to run

Notes:
- eventual speaker notes
```

The command should start with `stepCommandPrefix` specified in the `<root>/.sfeir-theme-config.json`. This command should also contains an existing lab command.

##### S_011 every lab slide should refer an existing lab

Every lab referred in a lab slide should match an existing lab directory in the `<root>/steps` directory.

Example of lab slide referencing `01-getting-started` lab

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab

<br>

1. First thing to do
2. Another thing to do
3. Last thing to do

<br>

- note for the students

### 01-getting-started
```

And we expect the `01-getting-started` directory exist.

```
<root>
...
└── steps
    ├── 01-getting-started
    ├── ...
```

##### S_006 every lab slide should have lab format

Every labs should have the expected format:

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab

<br>

1. First thing to do
2. Another thing to do
3. Last thing to do

<br>

- note for the students

### command to run

Notes:
- eventual speaker notes
```

The command should start with `stepCommandPrefix` specified in the `<root>/.sfeir-theme-config.json`. This command should also contains an existing lab command.

#### Images / slides checks

##### S_007 every images (relative one's only) in a slide should exists

Every images linked in a slide should exists in the assets directory `<root>/docs/assets/images/`.

##### S_008 every images in assets should be referenced at least in one slide

Every images in `<root>/docs/assets/images/` directory should be linked in a slide.

Note: images referenced in `ignoreAssets` in the configuration file will be ignored.

#### CSS classes

##### S_009 every classes used in slide files should be known

Every classes used in a slide file should exists:

- in `<root>/docs/web_modules/sfeir-school-theme/dist/sfeir-school-theme.css`;
- in `<root>/docs/css/slides.css`;
- in any css files declared in the property `extraCssFiles` in the `<root>/.sfeir-theme-config.json`;

### Labs checks

#### General labs checks

##### L_001 every labs should be used in a slide

Every lab should be referenced in the lab slide. Lab is considered referenced when the lab name is present in a lab slide.

Example:

If you have a lab named `01-getting-started`, you should have a lab slide like:

```
<!-- .slide: class="exercice" -->

# Getting started

## Lab

<br>

1. first thing to do
2. second thing to do

### 01-getting-started
```

Note: if you have configured a command prefix (check `stepCommandPrefix` option for more details), the last lab slide row should be `### <stepCommandPrefix><lab name>`. For example, with `stepCommandPrefix: "npm run "`, you should have `### npm run 01-getting-started`.

#### Workspace / Scripts checks

##### L_002 every lab should be declared in the workspace (either "workspaces" or "labs" in a file `<root>/steps/package.json` or `<root>/steps/labs.json` at the root of "steps" directory)

Every lab should be declared either in `<root>/steps/package.json` or `<root>/steps/labs.json`.

For `package.json` format:

```Json
{
    "workspaces": [
        "01-getting-started",
        "01-getting-started-solution"
    ]
}
```

For `labs.json` format:

```Json
{
    "labs": [
        "01-getting-started",
        "01-getting-started-solution"
    ]
}
```

##### L_003 every lab should have a script in `package.json` to start it (only if workspace is declared in a `<root>/steps/package.json` file) (NPM PROJECT ONLY)

Rules for NPM projects only. If you have a `<root>/steps/package.json` the this rules will be activated automatically.

Every lab should have a dedicated script in the `package.json`.

```Json
{
    "workspaces": [
        "01-getting-started",
        "01-getting-started-solution"
    ],
    "scripts": {
        "01-getting-started": "...",
        "01-getting-started-solution": "..."
    }
}
```

##### L_004 every lab should have a `package.json` with corresponding name (only if workspace is declared in a `<root>/steps/package.json` file) (NPM PROJECT ONLY)

Rules for NPM projects only. If you have a `<root>/steps/package.json` the this rules will be activated automatically.

Every lab in the `workspaces` property in `<root>/steps/package.json` file should correspond to a directory in `<root>/steps/` with a package.json file.

#### Instructions checks

##### L_005 every lab should have a `README.md`

Every lab directory in `<root>/steps/` should contain a `README.md` file with the lab title and the correct command.

Example of minimal `README.md`:

```Markdown
# 01-getting-started instructions

npm run 01-getting-started
```

##### L_006 every lab `README.md` should have correct title

Every lab directory in `<root>/steps/` should contain a `README.md` file with the lab title and the correct command.

Example of minimal `README.md`:

```Markdown
# 01-getting-started instructions

npm run 01-getting-started
```

##### L_007 every lab `README.md` should contains the correct command to start the lab

Every lab directory in `<root>/steps/` should contain a `README.md` file with the lab title and the correct command.

Example of minimal `README.md`:

```Markdown
# 01-getting-started instructions

npm run 01-getting-started
```

Note: this rule is only applied if you have specified `stepCommandPrefix` specified in the `<root>/.sfeir-theme-config.json`.

#### Solutions checks

##### L_008 every lab should have solution

Every lab should have a equivalent solution's lab. For example, if you create a lab "01-getting-started", you should create an other lab "01-getting-started-solution".

Note: if it does not make sense to have a solution to a specific lab, you can add a `.nosolution` file and omit the lab solution. If you add a `.nosolution`, you should not add a lab solution.

##### L_009 every solution directory should match a lab

Every lab with `-solution` suffix should match a lab with the exact same name without the `-solution` suffix.

##### L_010 every solution `README.md` should be the same as the lab's one

You can omit solution's lab `README.md`, but if you add one: both lab and solution's lab should have the same `README.md` file content.
