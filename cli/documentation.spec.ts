import fs from "node:fs";
import { describe, expect, it } from "vitest";

const README = fs.readFileSync("./cli/README.md", "utf-8");
const RULE_FILES = [
    "./cli/command/check/check-docs.ts",
    "./cli/command/check/check-labs.ts",
    "./cli/command/check/check-root-dir.ts",
].map((file) => fs.readFileSync(file, "utf-8"));
const CHECK_COMMAND_TESTS = fs.readFileSync(
    "./cli/command-check.spec.ts",
    "utf-8",
);

describe("Documentation", () => {
    const ruleCodesFromReadme = README.match(/([GSL]_\d{3})/g) ?? [];
    const concatenedRuleFiles = RULE_FILES.join("\n");
    const ruleCodesFromCode = ensureUnique(
        concatenedRuleFiles.match(/([GSL]_\d{3})/g) ?? [],
    );
    const allCodes = ensureUnique([
        ...ruleCodesFromReadme,
        ...ruleCodesFromCode,
    ]);

    for (const ruleCode of allCodes) {
        describe(ruleCode, () => {
            it("should correspond to a documented rule", () => {
                expect(ruleCodesFromReadme).includes(ruleCode);
            });
            it("should be unique in the documentation", () => {
                expect(ruleCodesFromReadme.filter((code) => code === ruleCode))
                    .toHaveLength(1);
            });
            it("should correspond to a check in the code", () => {
                expect(ruleCodesFromCode).includes(ruleCode);
            });
            it("should have at least one unit test", () => {
                expect(CHECK_COMMAND_TESTS).includes(`[${ruleCode}]`);
                expect(CHECK_COMMAND_TESTS).includes(
                    `\\[CheckError\\] ${ruleCode} `,
                );
            });
        });
    }
});

function ensureUnique(array: string[]): string[] {
    return [...new Set(array)];
}
