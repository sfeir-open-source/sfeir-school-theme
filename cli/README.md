# CLI

## Check

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

##### S_004 every lab slide file contains the command to run the exercise

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

#### CSS classes

##### S_009 every classes used in slide files should be known

Every classes used in a slide file should exists:

- in `<root>/docs/web_modules/sfeir-school-theme/dist/sfeir-school-theme.css`;
- in `<root>/docs/css/slides.css`;
- in any css files declared in the property `extraCssFiles` in the `<root>/.sfeir-theme-config.json`;

### Labs checks

#### General labs checks

##### L_001 every labs should be used in a slide

Every lab should be referenced in the lab slide.

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

#### Solutions checks

##### L_008 every lab should have solution

Every lab should have a equivalent solution's lab. For example, if you create a lab "01-getting-started", you should create an other lab "01-getting-started-solution".

##### L_009 every solution directory should match a lab

Every lab with `-solution` suffix should match a lab with the exact same name without the `-solution` suffix.

##### L_010 every solution `README.md` should be the same as the lab's one

Both lab and solution's lab should have the same `README.md` file content.
