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

Add to the `slides/package.json`:

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
        working-directory: ./slides
    permissions:
      contents: read
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

# From other directory:
npx sfeir-school-theme init-config --rootDir=path/to/training/root/directory
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

# From other directory:
npx sfeir-school-theme info --rootDir=path/to/training/root/directory
```

```
# Labs

 - 001-ouverture-de-l-usine-lab(-solution)
 - 002-preparer-la-pate-lab(-solution)
 - 003-preparer-les-pommes-lab(-solution)
 - 004-foncer-la-tarte-lab(-solution)
 - 005-cuire-la-tarte-lab(-solution)
 - 006-tests-lab(-solution)
 - 099-bonus-simple-mapping-lab(-solution)
 - 100-bonus-chevre-chaud-lab(-solution)
```

### Get school theme version

This command will give you the version of the installed `sfeir-school-theme` CLI

```Bash
npx sfeir-school-theme version
```

```
Version: <installed sfeir-school-theme version>
```

### Migrate a school

The package ships two more binaries, next to `sfeir-school-theme`:

```Bash
# Run one transition (from the training root directory, or from slides/ or docs/):
npx sfeir-school-theme-migrate --from=v4 --to=v5

# Clean up obsolete markup in the slides markdown (empty .slide comments, legacy classes):
npx sfeir-school-theme-cleanup
```

`sfeir-school-theme-migrate` needs at least one of `--from=<version>` / `--to=<version>`: each flag filters the known transitions (`v3 -> v4`, `v4 -> v5`), so a single flag runs the matching one (`--to=v5` runs `v4 -> v5`). Without any flag, it prints its usage and exits with code 1; `--help` prints the usage and exits with code 0. Any other argument is rejected. Run the transitions one at a time, oldest first (a v3 school runs `--from=v3 --to=v4`, then `--from=v4 --to=v5`).

The `v4 -> v5` transition moves everything in `docs/` to `slides/` except `docs/adr/` (skipped when `slides/` already exists), renames `steps/` to `labs/` and the pre-v5 configuration keys, then seeds the theme ADRs and the license files when absent. Lab directories are not renamed: rename them to `NNN-name-lab` by hand (see `L_011`).

## Configuration files

The `.sfeir-theme-config.json` file (created via `init-config`, at the training root) lets you override the CLI's default behavior for your training. Every key is optional and has a sane default; each one only affects the specific rules listed below.

The five keys below are the whole override surface. Any other key is ignored and reported by `G_005` (a warning naming the key).

### extraCssFiles: string[] (optional)

Default: `[]`

Extra stylesheets of your training, as paths relative to `<root>/slides` (e.g. `"css/code.css"`). The classes they define are considered known by `S_009`, on top of the theme CSS and `<root>/slides/css/slides.css`. A listed file that does not exist stops the check with an error.

**Impacts:** `S_009` only.

### labCommandPrefix: string (optional)

Default: `""`

If you specify `labCommandPrefix`, every command of the training will be excepted to start with this prefix.

For example, if you defined `"labCommandPrefix": "npm run "`, your lab slide should look like:

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab

...

### npm run lab-name
```

**Impacts:** `S_005`, `S_011`, `L_001` and `L_007`. Without it, `L_007` and the strict part of `S_005`/`S_011` are entirely skipped (no check runs at all), and the remaining part of `S_005` cannot locate a command row, so it passes for any non-empty slide. `L_001` still runs, but only does a loose substring match on the lab name without requiring the prefix — a false negative risk if the lab name happens to appear elsewhere in the slide.

### ignoreLabsDirectories: string[] (optional)

Default: `[]`

You can specify here every directories which are not lab but need to be in the `labs` directory (node_modules, common modules, data, etc.)

**Impacts:** every `L_0XX` rule (including the `L_011` naming rule) and `S_011`. A listed directory is excluded from the lab set entirely, so it is never expected to have a README, a solution, a workspace declaration, a lab name, etc.

### ignoreAssets: string[] (optional)

Default: `[]`

Image paths, relative to `<root>/slides/assets` (e.g. `"images/unused-on-purpose.png"`), that `S_008` will not report as unused.

**Impacts:** `S_008` only.

### ignoreCommandCheck: string[] (optional)

Default: `[]`

Some labs legitimately have no command to run (a browser-only lab, a manual/UI exercise, etc.). List their slide path here (as declared in `slides.js`, e.g. `"05-accessibility-lab.md"`) to exempt them from the command checks below.

**Impacts:** `S_005` and `S_011` are entirely skipped for a listed slide. `S_006` (lab slide format) still applies.

## Rules

### Global checks

##### G_001 the root directory exists (current working dir by default, --rootDir value if specified)

To make the sfeir-school-theme CLI work correctly, it should be run in the repository root (or be run with --rootDir specified), and the root directory should exists.

##### G_002 the `<root>/slides` directory exists

The root directory should contains a minimal structure:

```
<root>
├── .sfeir-theme-config.json   (optional, see "Configuration files")
├── CONTRIBUTION_GUIDE.md      (or CONTRIBUTING.md, see G_004)
├── docs                       (recommended: ADRs and other project documentation)
|   ├── adr
|   |   ├── ...
├── labs                       (optional: only if the training has labs)
|   ├── ...
├── LICENSE                    (recommended)
├── README.md                  (recommended)
└── slides                     (required)
    ├── ...
```

Only `slides/` is required (an error that stops the check). `labs/` is optional: a training without hands-on exercises has no `labs/` directory, and every `L_0XX` rule is then skipped.

`docs/` is reserved for ADRs and other project documentation, not for the
slide deck — see [ADR theme-0002](../docs/adr/theme-0002-slides-and-docs-directories.md).

If `slides/` is missing but `docs/` still holds a legacy slide deck (`docs/scripts/slides.js` or `docs/markdown/`), the error asks you to migrate the project:

```Bash
npx sfeir-school-theme-migrate --from=v4 --to=v5
```

Note: `G_003` ("the `<root>/labs` directory exists") is retired since `labs/` became optional; the code is not reused.

##### G_004 the `<root>/CONTRIBUTION_GUIDE.md` (or `<root>/CONTRIBUTING.md`) file should exists and contains required content

To ensure every trainer to be able to work smoothly on any training, a contribution guide should be present at the root and contain the required sections, each one with some content. Its name is `CONTRIBUTION_GUIDE.md` or `CONTRIBUTING.md` (exact name, the one GitHub surfaces); when both exist, `CONTRIBUTION_GUIDE.md` is the one checked. The warning about a missing file is raised only when neither exists.

This rule is a **warning**: it never fails the check.

The required sections (`## ` headings) are:

- How to start the slides on local?
- How to start a lab?
- How to add a new lab?
- What tasks to do before push a PR?
- What are the specific rules of this training?

##### G_005 the `<root>/.sfeir-theme-config.json` file only uses known keys

Every key of `.sfeir-theme-config.json` should be one of the keys documented in "Configuration files". An unknown key (a typo, or a pre-v5 key such as `stepCommandPrefix` or `ignoreStepsDirectories`) has no effect, so it is reported with its name. For a pre-v5 key, the message names its replacement and the migration to run.

This rule is a **warning**: it never fails the check.

### Slides checks

#### General slides checks

##### S_010 the script `<root>/slides/scripts/slides.js` should contain an exported function `formation()`

Every school should have a file `slides.js` in the correct directory and with an exported function `formation()`.

`<root>/slides/scripts/slides.js` :

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
    ...schoolSlides(),
    ...
  ].map((slidePath) => ({ path: slidePath }));
}

await SfeirThemeInitializer.init({
  slidesFactory: formation,
  knowStyles: ['my-image-style'], // see S_009
});
```

The CLI evaluates this file in Node.js: the `SfeirThemeInitializer` import is replaced by a stand-in whose `init()` only records its parameters (so `S_009` can read `knowStyles`). `slides.js` must therefore import nothing but `SfeirThemeInitializer`: the CLI evaluates it from a `data:` URL, where relative imports cannot be resolved (`S_010` then reports the file as invalid).

##### S_001 every entry returned by the function `formation()` in `<root>/slides/scripts/slides.js` is valid

Every entry returned by the function `formation()` should be an object which have a path property.

##### S_002 every entry returned by the function `formation()` in `<root>/slides/scripts/slides.js` exists in the `<root>/slides/markdown` directory

Every entry returned by the function `formation()` should have a path matching an existing markdown file in the `<root>/slides/markdown` directory.

##### S_003 every markdown file in the `<root>/slides/markdown` directory is declared in the `<root>/slides/scripts/slides.js`

Every markdown files in the `<root>/slides/markdown` directory should be declared with a valid entry in the result of the `formation()` function in `<root>/slides/scripts/slides.js`.

#### Lab slides specific checks

A slide is a lab slide when its path (as declared in `slides.js`) contains `-lab-` or ends with `-lab.md` (e.g. `10-lab-getting-started.md`, `10-getting-started-lab.md`). The rules below only apply to those slides.

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

The command should start with `labCommandPrefix` specified in the `<root>/.sfeir-theme-config.json`. This command should also contains an existing lab command.

Note: if a lab genuinely has no command to run, list its slide path in `ignoreCommandCheck` in the `<root>/.sfeir-theme-config.json` to skip this rule (and `S_011`) for it.

##### S_011 every lab slide should refer an existing lab

Every lab referred in a lab slide should match an existing lab directory in the `<root>/labs` directory.

Example of lab slide referencing `001-getting-started-lab` lab (with `"labCommandPrefix": "npm run "`)

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

### npm run 001-getting-started-lab
```

And we expect the `001-getting-started-lab` directory exist.

```
<root>
...
└── labs
    ├── 001-getting-started-lab
    ├── ...
```

Note: this rule is only applied if `labCommandPrefix` is specified in the `<root>/.sfeir-theme-config.json`, and not for slides listed in `ignoreCommandCheck`.

##### S_006 every lab slide should have lab format

Every labs should have the expected format. You should have at least two things to be compliant:

- `<!-- .slide: class="exercice" -->` at the beginning of the slide;
- `## Lab` to have a "Lab" mention visible;

Minimal example:

```Markdown
<!-- .slide: class="exercice" -->

# Lab title

## Lab
```

Full example:

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

Both lines are compared after trimming, so they must be exactly `<!-- .slide: class="exercice" -->` and `## Lab`. The command row is checked by `S_005`.

#### Images / slides checks

##### S_007 every images (relative one's only) in a slide should exists

Every images linked in a slide should exists in the assets directory `<root>/slides/assets/images/`.

##### S_008 every images in assets should be referenced at least in one slide

Every images in `<root>/slides/assets/images/` directory should be linked in a slide.

Note: images referenced in `ignoreAssets` in the configuration file will be ignored.

#### CSS classes

##### S_009 every classes used in slide files should be known

Classes reach the rendered HTML through two channels, checked differently.

**Class attributes** (`<!-- .slide: class="…" -->`, or a line starting with `<!-- .element: class="…" -->`): every class is applied as-is, so it should be defined (exact class name in a selector, not a substring) in:

- `<root>/slides/web_modules/sfeir-school-theme/dist/sfeir-school-theme.css`;
- `<root>/slides/css/slides.css`;
- any css files declared in the property `extraCssFiles` in the `<root>/.sfeir-theme-config.json`;
- or be one of the classes the theme applies by JavaScript: `list-fragment` and the background classes (`first-slide`, `transition`, `speaker-slide`, `quote-slide`, `sfeir-slide`, `bg-white`, `bg-pink`, `bg-blue`, `bg-green`, `bg-blur`, `transition-bg-sfeir-1..3`, `transition-bg-blue-1..3`, `transition-bg-blue-blur`, `transition-bg-green-1..6`).

**Image titles** (`![](./assets/images/logo.png 'company h-100')`): talk-control converts a title word into a class only if it is a known style; any other word stays in the `title` attribute (a tooltip), silently. So every word should be:

1. registered: a talk-control built-in style (`company`, `speaker`, `badge`, `center`, `full-center`, `float-left`, `float-right`, `full-width`, `full-height`, `h-`/`w-`/`hm-`/`wm-` from 50 to 1000 by 50, `mt-`/`mb-` from 10 to 1000 by 10) or listed in the `knowStyles` passed to `SfeirThemeInitializer.init()` in `<root>/slides/scripts/slides.js`;
2. and defined, like a class attribute (see above).

Example registering a project style in `<root>/slides/scripts/slides.js` (defined in `<root>/slides/css/slides.css`):

```JavaScript
await SfeirThemeInitializer.init({
  slidesFactory: formation,
  knowStyles: ['my-image-style'],
});
```

**Exception: icon and QR code titles.** A title holding `tc-icons` (`![](clock 'tc-icons feather tc-big')`) or `tc-qrcode` (`![](https://sfeir.com 'tc-qrcode')`) is rendered by talk-control's icon or QR code extension, which applies every word as a class. Its words are therefore checked like a class attribute (defined, no `knowStyles` registration needed), except the icon pack keyword (`fa`, `feather`, `material-symbols`), which only selects the icon pack.

Not checked: classes in HTML tags (`<div class="…">`) and the classes of a `<!-- .element … -->` comment placed after content on the same line. An image title followed by such a comment (`![](clock 'tc-icons feather')<!-- .element: style="…" -->`) is still checked.

### Labs checks

#### General labs checks

##### L_001 every labs should be used in a slide

Every lab should be referenced in the lab slide. Lab is considered referenced when the lab name is present in a lab slide.

Example:

If you have a lab named `001-getting-started-lab`, you should have a lab slide like:

```
<!-- .slide: class="exercice" -->

# Getting started

## Lab

<br>

1. first thing to do
2. second thing to do

### 001-getting-started-lab
```

Note: if you have configured a command prefix (check `labCommandPrefix` option for more details), the last lab slide row should be `### <labCommandPrefix><lab name>`. For example, with `labCommandPrefix: "npm run "`, you should have `### npm run 001-getting-started-lab`.

##### L_011 every lab directory should be named `NNN-name-lab` or `NNN-name-lab-solution`

Every directory directly under `<root>/labs/` (except the ones listed in `ignoreLabsDirectories`) is a lab or a lab solution, and its name should be:

- `NNN-name-lab` for a lab: exactly 3 digits, a kebab-case name (lowercase letters, digits and dashes), then the `-lab` suffix;
- `NNN-name-lab-solution` for its solution (see `L_008` to `L_010`, and the `.nosolution` marker).

```
<root>
└── labs
    ├── 001-getting-started-lab
    ├── 001-getting-started-lab-solution
    ├── 002-routing-lab
    ├── 002-routing-lab-solution
    ├── 003-bonus-lab               (with a `.nosolution` file)
    ├── common                      (listed in `ignoreLabsDirectories`)
```

Invalid examples: `01-getting-started-lab` (2 digits), `001-getting-started` (no `-lab` suffix), `001-Getting-Started-lab` (not kebab-case).

#### Workspace / Scripts checks

##### L_002 every lab should be declared in the workspace (either "workspaces" or "labs" in a file `<root>/labs/package.json` or `<root>/labs/labs.json` at the root of "labs" directory)

Every lab directory (solutions included) should be declared either in `<root>/labs/package.json` (`workspaces`, or else a `labs` array) or in `<root>/labs/labs.json` (`labs` array). When both files exist, `package.json` wins.

For `package.json` format:

```Json
{
    "workspaces": [
        "001-getting-started-lab",
        "001-getting-started-lab-solution"
    ]
}
```

For `labs.json` format:

```Json
{
    "labs": [
        "001-getting-started-lab",
        "001-getting-started-lab-solution"
    ]
}
```

##### L_003 every lab should have a script in `package.json` to start it (only if workspace is declared in a `<root>/labs/package.json` file) (NPM PROJECT ONLY)

Rules for NPM projects only. If you have a `<root>/labs/package.json` the this rules will be activated automatically.

Every lab should have a dedicated script in the `package.json`.

```Json
{
    "workspaces": [
        "001-getting-started-lab",
        "001-getting-started-lab-solution"
    ],
    "scripts": {
        "001-getting-started-lab": "...",
        "001-getting-started-lab-solution": "..."
    }
}
```

##### L_004 every lab should have a `package.json` with corresponding name (only if workspace is declared in a `<root>/labs/package.json` file) (NPM PROJECT ONLY)

Rules for NPM projects only. If you have a `<root>/labs/package.json` the this rules will be activated automatically.

Every lab in the `workspaces` property in `<root>/labs/package.json` file should correspond to a directory in `<root>/labs/` with a package.json file.

#### Instructions checks

##### L_005 every lab should have a `README.md`

Every lab directory in `<root>/labs/` should contain a `README.md` file with the lab title and the correct command.

Example of minimal `README.md`:

```Markdown
# 001-getting-started-lab instructions

npm run 001-getting-started-lab
```

##### L_006 every lab `README.md` should have correct title

Every lab directory in `<root>/labs/` should contain a `README.md` file whose title matches the lab name.

Example of minimal `README.md`:

```Markdown
# 001-getting-started-lab instructions

npm run 001-getting-started-lab
```

The README should contain the exact line `# <lab name> instructions` (no extra formatting around the lab name).

##### L_007 every lab `README.md` should contains the correct command to start the lab

Every lab directory in `<root>/labs/` should contain a `README.md` file with the correct command to start the lab.

Example of minimal `README.md`:

```Markdown
# 001-getting-started-lab instructions

**npm run 001-getting-started-lab**
```

Note: this rule is only applied if you have specified `labCommandPrefix` specified in the `<root>/.sfeir-theme-config.json`.

#### Solutions checks

##### L_008 every lab should have solution

Every lab should have a equivalent solution's lab. For example, if you create a lab "001-getting-started-lab", you should create an other lab "001-getting-started-lab-solution".

Note: if it does not make sense to have a solution to a specific lab, you can add an (empty) `.nosolution` file inside the lab directory (`<root>/labs/001-getting-started-lab/.nosolution`) and omit the lab solution. If you add a `.nosolution`, you should not add a lab solution.

##### L_009 every solution directory should match a lab

Every lab with `-solution` suffix should match a lab with the exact same name without the `-solution` suffix.

##### L_010 every solution `README.md` should be the same as the lab's one

You can omit solution's lab `README.md`, but if you add one: both lab and solution's lab should have the same `README.md` file content.
