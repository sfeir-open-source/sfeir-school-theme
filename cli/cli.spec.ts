import { describe, expect, it } from "vitest";
import { CheckCommand, InitConfigCommand, parseArgs } from "./cli";

describe(parseArgs.name, () => {
    it("should enable help command by default", () => {
        expect(parseArgs(withBaseArgs(), "./cwd").type).toBe("help");
    });

    it("should enable help command if 'help' is present", () => {
        expect(parseArgs(withBaseArgs("help"), "./cwd").type).toBe("help");
    });

    it("should enable version command if 'version' is present", () => {
        expect(parseArgs(withBaseArgs("version"), "./cwd").type).toBe(
            "version",
        );
    });

    it("should enable help command if 'version' and 'help' are present", () => {
        expect(parseArgs(withBaseArgs("version", "help"), "./cwd").type).toBe(
            "help",
        );
        expect(parseArgs(withBaseArgs("help", "version"), "./cwd").type).toBe(
            "help",
        );
    });

    it("should enable check command if 'check' is present", () => {
        const res = parseArgs(withBaseArgs("check"), "./cwd");
        expect(res.type).toBe("check");
        expect((res as CheckCommand).rootDir).toBe("./cwd");
    });

    it("should enable version command if 'check' and 'version' are present", () => {
        const res = parseArgs(withBaseArgs("check", "version"), "./cwd");
        expect(res.type).toBe("version");
    });

    it("should enable help command if 'check' and 'help' are present", () => {
        const res = parseArgs(withBaseArgs("check", "help"), "./cwd");
        expect(res.type).toBe("help");
    });

    it("should enable check command with custom root dir if 'check' is present with option --rootDir", () => {
        const res = parseArgs(
            withBaseArgs("check", "--rootDir=/other/path"),
            "./cwd",
        );
        expect(res.type).toBe("check");
        expect((res as CheckCommand).rootDir).toBe("/other/path");
    });

    it("should enable init-config command if 'init-config' is present", () => {
        const res = parseArgs(withBaseArgs("init-config"), "./cwd");
        expect(res.type).toBe("init-config");
        expect((res as InitConfigCommand).rootDir).toBe("./cwd");
    });

    it("should enable version command if 'init-config' and 'version' are present", () => {
        const res = parseArgs(withBaseArgs("init-config", "version"), "./cwd");
        expect(res.type).toBe("version");
    });

    it("should enable help command if 'init-config' and 'help' are present", () => {
        const res = parseArgs(withBaseArgs("init-config", "help"), "./cwd");
        expect(res.type).toBe("help");
    });

    it("should enable init-config command if 'init-config' and 'check' are present", () => {
        const res = parseArgs(withBaseArgs("check", "init-config"), "./cwd");
        expect(res.type).toBe("init-config");
    });

    it("should enable init-config command with custom root dir if 'init-config' is present with option --rootDir", () => {
        const res = parseArgs(
            withBaseArgs("init-config", "--rootDir=/other/path"),
            "./cwd",
        );
        expect(res.type).toBe("init-config");
        expect((res as InitConfigCommand).rootDir).toBe("/other/path");
    });

    function withBaseArgs(...args: string[]): string[] {
        return [
            "/path/to/node",
            "/path/to/main.js",
            ...args,
        ];
    }
});
