# CLI

## Check

### Global checks

-   G_001 the root directory exists (current working dir by default, --rootDir value if specified);
-   G_002 the `<root>/docs` directory exists;
-   G_003 the `<root>/steps` directory exists;

### Slides checks

#### General slides checks

-   S_001 every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` is valid;
-   S_002 every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` exists in the `<root>/docs/markdown` directory;
-   S_003 every markdown file in the `<root>/docs/markdown` directory is declared in the `<root>/docs/scripts/slides.js`;

#### Lab slides specific checks

-   S_004 every lab slide file contains the command to run the exercise;
-   S_005 every lab slide file contains the valid command to run the exercise;
-   S_006 every lab slide should have lab format;

#### Images / slides checks

-   S_007 every images (relative one's only) in a slide should exists;
-   S_008 every images in assets should be referenced at least in one slide;

#### CSS classes

-   S_009 every classes used in slide files should be known;

### Labs checks

#### General labs checks

-   L_001 every labs command should be used in a slide;

#### Workspace / Scripts checks

-   L_002 every lab should be declared in the workspace (either "workspaces" or "labs" in a file `<root>/steps/package.json` or `<root>/steps/labs.json` at the root of "steps" directory);
-   L_003 every lab should have a script in `package.json` to start it (only if workspace is declared in a `<root>/steps/package.json` file);
-   L_004 every lab should have a `package.json` with corresponding name (only if workspace is declared in a `<root>/steps/package.json` file);

#### Instructions checks

-   L_005 every lab should have a `README.md`;
-   L_006 every lab `README.md` should have correct title;
-   L_007 every lab `README.md` should contains the correct command to start the lab;

#### Solutions checks

-   L_008 every lab should have solution;
-   L_009 every solution directory should match a lab;
-   L_010 every solution `README.md` should be the same as the lab's one;
