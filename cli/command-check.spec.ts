import {
    CheckError,
    __TEST_ONLY__cleanupErrors,
    getErrors,
} from "./utils/assert.utils";
import { beforeEach, describe, expect, it } from "vitest";
import {
    configFile,
    imageFile,
    labReadmeMdFile,
    labSlideFile,
    labsJsonFile,
    minimalValidLabStructure,
    oneLabStructure,
    packageJsonFile,
    slideCssFile,
    slideJsFile,
    web_modules,
} from "./command-check.spec-helper";
import { buildProject } from "./test-utils/project-builder.utils";
import { checkCommandInternal } from "./command/check/internal";

describe("check command", () => {
    beforeEach(() => __TEST_ONLY__cleanupErrors());
    describe("valid projects", () => {
        it("minimal valid empty project", async () => {
            const rootDir = buildProject({
                ...configFile({ stepCommandPrefix: "npm run " }),
                docs: {
                    assets: { images: {} },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {},
                    scripts: {
                        "slides.js": slideJsFile(),
                    },
                    ...web_modules(),
                },
                steps: {
                    "package.json": packageJsonFile(),
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it("simple project with no command prefix", async () => {
            const rootDir = buildProject({
                ...configFile({ stepCommandPrefix: "" }),
                docs: {
                    assets: {
                        images: {
                            "bg.png": imageFile(),
                            "foo.png": imageFile(),
                            "foo2.png": imageFile(),
                            "foo3.png": imageFile(),
                            "foo4.png": imageFile(),
                            "foo5.png": imageFile(),
                            "foo6.png": imageFile(),
                        },
                    },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {
                        "01-getting-started.md": "![](./assets/images/foo.png)",
                        "02-html-images.md":
                            '<!-- .slide: data-background="./assets/images/bg.png"  -->\n' +
                            '<img src="./assets/images/foo2.png"/>\n' +
                            '<img class="tc-bg" src="./assets/images/foo3.png"/>\n' +
                            '<div>\n' +
                            '    <img src="./assets/images/foo4.png" />\n' +
                            '</div>\n' +
                            '<img src="./assets/images/foo5.png"/><img src="./assets/images/foo6.png"/>\n'
                        ,
                        "99-lab-getting-started.md": labSlideFile({
                            title: "Getting started",
                            cmd: "Go to 01-getting-started",
                        }),
                    },
                    scripts: {
                        "slides.js": slideJsFile([
                            "01-getting-started.md",
                            "02-html-images.md",
                            "99-lab-getting-started.md",
                        ]),
                    },
                    ...web_modules(),
                },
                steps: {
                    "labs.json": labsJsonFile({
                        labs: [
                            "01-getting-started",
                            "01-getting-started-solution",
                        ],
                    }),
                    "01-getting-started": {
                        "README.md": labReadmeMdFile("01-getting-started", ""),
                    },
                    "01-getting-started-solution": {
                        "README.md": labReadmeMdFile("01-getting-started", ""),
                    },
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it("simple npm project with workspace", async () => {
            const rootDir = buildProject({
                ...configFile({ stepCommandPrefix: "npm run " }),
                docs: {
                    assets: {
                        images: {
                            "foo.png": imageFile(),
                        },
                    },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {
                        "01-getting-started.md": "![](./assets/images/foo.png)",
                        "01-lab-getting-started.md": labSlideFile({
                            title: "Getting started",
                            cmd: "npm run 01-getting-started",
                        }),
                    },
                    scripts: {
                        "slides.js": slideJsFile([
                            "01-getting-started.md",
                            "01-lab-getting-started.md",
                        ]),
                    },
                    ...web_modules(),
                },
                steps: {
                    "package.json": packageJsonFile({
                        workspaces: ["01-getting-started"],
                        scripts: {
                            "01-getting-started": "",
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it("simple npm project without workspace", async () => {
            const rootDir = buildProject({
                ...configFile({ stepCommandPrefix: "npm run " }),
                docs: {
                    assets: { images: {} },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {
                        "01-lab-getting-started.md": labSlideFile({
                            title: "Getting started",
                            cmd: "npm run 01-getting-started",
                        }),
                    },
                    scripts: {
                        "slides.js": slideJsFile(["01-lab-getting-started.md"]),
                    },
                    ...web_modules(),
                },
                steps: {
                    "package.json": packageJsonFile({
                        labs: ["01-getting-started"],
                        scripts: {
                            "01-getting-started": "",
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it("npm project with command prefix override", async () => {
            const rootDir = buildProject({
                ...configFile({ stepCommandPrefix: "yarn run " }),
                docs: {
                    assets: { images: {} },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {
                        "01-lab-getting-started.md": labSlideFile({
                            title: "Getting started",
                            cmd: "yarn run 01-getting-started",
                        }),
                    },
                    scripts: {
                        "slides.js": slideJsFile(["01-lab-getting-started.md"]),
                    },
                    ...web_modules(),
                },
                steps: {
                    "package.json": packageJsonFile({
                        workspaces: ["01-getting-started"],
                        scripts: {
                            "01-getting-started": "",
                        },
                    }),
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });

        it("Slides with images", async () => {
            const rootDir = buildProject({
                docs: {
                    assets: {
                        images: {
                            "intro.png": imageFile(),
                            "logo-sfeir-blanc.png": imageFile(),
                            speakers: {
                                "CMA.jpg": imageFile(),
                                "the-conf.svg": imageFile(),
                            },
                        },
                    },
                    css: {
                        "slides.css": slideCssFile(),
                    },
                    markdown: {
                        "00-speaker-cma.md": `
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
                        "01-getting-started.md": `
# Getting started

![](./assets/images/intro.png)
                        `,
                    },
                    scripts: {
                        "slides.js": slideJsFile([
                            "00-speaker-cma.md",
                            "01-getting-started.md",
                        ]),
                    },
                    ...web_modules(),
                },
                steps: {
                    "package.json": packageJsonFile({}),
                },
            });

            await checkCommandInternal({ type: "check", rootDir });
            console.error(getErrors());
            expect(getErrors()).toHaveLength(0);
        });
    });

    describe("invalid projects", () => {
        describe("Global checks", () => {
            it("missing rootDir [G_001]", async () => {
                try {
                    await checkCommandInternal({
                        type: "check",
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
            it("missing docs dir [G_002]", async () => {
                const rootDir = buildProject({
                    steps: {
                        "package.json": packageJsonFile(),
                    },
                });

                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] G_002 Project should have a 'docs' directory/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("missing steps dir [G_003]", async () => {
                const rootDir = buildProject({
                    docs: {
                        assets: { images: {} },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {},
                        scripts: {
                            "slides.js": slideJsFile(),
                        },
                        ...web_modules(),
                    },
                });

                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] G_003 Project should have a 'steps' directory/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
        });

        describe("Slides checks", () => {
            it("invalid slides.js entry [S_001]", async () => {
                const rootDir = buildProject({
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js":
                                `export function formation() { return ['01-getting-started.md'] }\n`,
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_001 slides.js entry ""01-getting-started.md"" should be a valid entry/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("not existing markdown file in slides.js [S_002]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                                "02-not-existing-file.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_002 slides.js entry "02-not-existing-file.md" does not match an existing file/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("not declared in slides.js markdown file [S_003]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                            "02-not-existing-file.md": "",
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_003 "02-not-existing-file.md" should be used/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("lab slide without command [S_004]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                            "01-lab-getting-started-bis.md": labSlideFile({
                                title: "Getting started bis",
                                cmd: "",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                                "01-lab-getting-started-bis.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_004 "01-lab-getting-started-bis.md" should contains the command to run the exercise/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("lab slide without a valid command [S_005]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                            "01-lab-getting-started-bis.md": labSlideFile({
                                title: "Getting started bis",
                                cmd: "npm run 01-getting-starte",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                                "01-lab-getting-started-bis.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_005 "01-lab-getting-started-bis.md" should contains the valid command to run the exercise/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("lab slide without a valid command [S_006]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                            "01-lab-getting-started-bis.md":
                                "# Getting started\n\nnpm run 01-getting-started",
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                                "01-lab-getting-started-bis.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_006 "01-lab-getting-started-bis.md" should use lab slide format/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("slide should contains existing image [S_007]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)\n![](./assets/images/foo2.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_007 ".*\/docs\/assets\/images\/foo2.png" in "01-getting-started.md" should be an existing images/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });

            it("images in asset should be used [S_008]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                                "foo2.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] S_008 ".*\/docs\/assets\/images\/foo2.png" should be used/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("slide should only used existing css classes [S_009]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                '![](./assets/images/foo.png)\n<!-- .class="any-undefined-class" -->\n' +
                                "![](./assets/images/foo.png 'another-undefined-class')\n",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_009 "any-undefined-class" in "01-getting-started.md" is not a known css class/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                const reg2 =
                    /\[CheckError\] S_009 "another-undefined-class" in "01-getting-started.md" is not a known css class/;
                expectMatching(getErrors(), reg2).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it("slide.js should exists [S_010]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md": '',
                        },
                        scripts: {},
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_010 slides.js should export "formation" function/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("slide.js should have exported formation function [S_010]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md": '',
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]).replaceAll('export', '')
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started"],
                            scripts: {
                                "01-getting-started": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg1 =
                    /\[CheckError\] S_010 slides.js should export "formation" function/;
                expectMatching(getErrors(), reg1).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
        });
        describe("Labs checks", () => {
            it("labs not used in slide [L_001]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        "package.json": packageJsonFile({
                            workspaces: ["01-getting-started", "02-next"],
                            scripts: {
                                "01-getting-started": "",
                                "02-next": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_001 "02-next" should be used in a lab slide/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("labs not declared in workspace [L_002][L_003]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...minimalValidLabStructure("01-getting-started"),
                        ...minimalValidLabStructure("02-next"),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL002 =
                    /\[CheckError\] L_002 Lab "02-next" should be declared in the workspace \(either "workspaces" or "labs" in a file "package.json" or "labs.json" at the root of "steps" directory\)/;
                expectMatching(getErrors(), regL002).toHaveLength(1);
                const regL003 =
                    /\[CheckError\] L_003 Lab "02-next" should have corresponding script/;
                expectMatching(getErrors(), regL003).toHaveLength(1);
                const regL002Sol =
                    /\[CheckError\] L_002 Lab "02-next-solution" should be declared in the workspace \(either "workspaces" or "labs" in a file "package.json" or "labs.json" at the root of "steps" directory\)/;
                expectMatching(getErrors(), regL002Sol).toHaveLength(1);
                const regL003Sol =
                    /\[CheckError\] L_003 Lab "02-next-solution" should have corresponding script/;
                expectMatching(getErrors(), regL003Sol).toHaveLength(1);
                expect(getErrors()).toHaveLength(4);
            });
            it("labs in workspace but without package.json [L_004]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started", {
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        ...oneLabStructure("01-getting-started-solution", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started-solution",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_004 Lab "01-getting-started" should have a package.json with corresponding name/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("labs without README.md [L_005][L_010]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started",
                            }),
                            // "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        ...oneLabStructure("01-getting-started-solution", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started-solution",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL005 =
                    /\[CheckError\] L_005 Lab "01-getting-started" should have a README.md/;
                expectMatching(getErrors(), regL005).toHaveLength(1);
                const regL010 =
                    /\[CheckError\] L_010 Lab and solution of "01-getting-started" should have same README.md/;
                expectMatching(getErrors(), regL010).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it("labs with README.md missing some infos [L_006][L_007]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started",
                            }),
                            "README.md": "# 01-getting-started\n",
                        }),
                        ...oneLabStructure("01-getting-started-solution", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started-solution",
                            }),
                            "README.md": "# 01-getting-started\n",
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const regL006 =
                    /\[CheckError\] L_006 Lab "01-getting-started"'s README.md should contains the correct title/;
                expectMatching(getErrors(), regL006).toHaveLength(1);
                const regL007 =
                    /\[CheckError\] L_007 Lab "01-getting-started"'s README.md should contains the correct command/;
                expectMatching(getErrors(), regL007).toHaveLength(1);
                expect(getErrors()).toHaveLength(2);
            });
            it("every lab should have a solution [L_008]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_008 Lab "01-getting-started" should have a solution/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("lab solution should match a lab [L_009]", async () => {
                const rootDir = buildProject({
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started-solution", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started-solution",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_009 Solution lab "01-getting-started-solution" should match to a lab/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
            it("lab and solution should have same README.md [L_010]", async () => {
                const rootDir = buildProject({
                    ...configFile({ stepCommandPrefix: "npm run " }),
                    docs: {
                        assets: {
                            images: {
                                "foo.png": imageFile(),
                            },
                        },
                        css: {
                            "slides.css": slideCssFile(),
                        },
                        markdown: {
                            "01-getting-started.md":
                                "![](./assets/images/foo.png)",
                            "01-lab-getting-started.md": labSlideFile({
                                title: "Getting started",
                                cmd: "npm run 01-getting-started",
                            }),
                        },
                        scripts: {
                            "slides.js": slideJsFile([
                                "01-getting-started.md",
                                "01-lab-getting-started.md",
                            ]),
                        },
                        ...web_modules(),
                    },
                    steps: {
                        ...oneLabStructure("01-getting-started", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started"),
                        }),
                        ...oneLabStructure("01-getting-started-solution", {
                            "package.json": packageJsonFile({
                                name: "01-getting-started-solution",
                            }),
                            "README.md": labReadmeMdFile("01-getting-started") +
                                "\nHello\n",
                        }),
                        "package.json": packageJsonFile({
                            workspaces: [
                                "01-getting-started",
                                "01-getting-started-solution",
                            ],
                            scripts: {
                                "01-getting-started": "",
                                "01-getting-started-solution": "",
                            },
                        }),
                    },
                });
                try {
                    await checkCommandInternal({ type: "check", rootDir });
                } catch (err) {
                    console.error(err);
                }

                const reg =
                    /\[CheckError\] L_010 Lab and solution of "01-getting-started" should have same README.md/;
                expectMatching(getErrors(), reg).toHaveLength(1);
                expect(getErrors()).toHaveLength(1);
            });
        });
    });
});

function expectMatching(errors: CheckError[], expected: RegExp) {
    const messages = errors.map((err) => err.message);
    return expect(
        messages.filter((err) => err.match(expected) !== null),
        JSON.stringify(messages, undefined, 2),
    );
}
