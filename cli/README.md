# CLI

## Check

### Global checks

-   the root directory exists (current working dir by default, --rootDir value if specified);
-   the `<root>/docs` directory exists;
-   the `<root>/steps` directory exists;

### Slides checks

#### General slides checks

-   every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` is valid;
-   every entry returned by the function `formation()` in `<root>/docs/scripts/slides.js` exists in the `<root>/docs/markdown` directory;
-   every markdown file in the `<root>/docs/markdown` directory is declared in the `<root>/docs/scripts/slides.js`;

#### Lab slides specific checks

-   every lab slide file contains the command to run the exercise;
-   every lab slide file contains the valid command to run the exercise;
-   every lab slide should have lab format;

#### Images / slides checks

-   every images (relative one's only) in a slide should exists;
-   every images in assets should be referenced at least in one slide;

#### CSS classes

-   every classes used in slide files should be known;
