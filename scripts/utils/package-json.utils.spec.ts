import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PackageJson } from 'type-fest';
import { buildPackageJson } from './package-json.utils';
import fs from 'node:fs';
import packageJson from '../../package.json';
import path from 'node:path';
import { tmpdir } from 'node:os';

describe(buildPackageJson.name, () => {
    let testContext: ReturnType<typeof buildTestContext>;

    beforeEach(() => {
        testContext = buildTestContext();
    });
    afterEach(() => {
        testContext?.cleanup();
    });

    it('should create a package.json file with correct infos', () => {
        buildPackageJson(testContext.packageJson, testContext.dist);
        const distPackageJson = JSON.parse(
            testContext.readDistFile('package.json')
        );
        expect(distPackageJson.name).toEqual('sfeir-school-theme');
        expect(distPackageJson.version).toEqual('1.2.3');
        expect(distPackageJson.type).toEqual('module');
        expect(distPackageJson.main).toEqual('./sfeir-school-theme.js');
        expect(distPackageJson.license).toEqual('Apache-2.0');
        expect(distPackageJson.private).not.toBeDefined();
        expect(distPackageJson.dependencies).not.toBeDefined();
        expect(distPackageJson.devDependencies).not.toBeDefined();
        expect(distPackageJson.scripts).not.toBeDefined();
        expect(distPackageJson.overrides).not.toBeDefined();
    });
});

function buildTestContext() {
    const dist = fs.mkdtempSync(path.join(tmpdir(), 'fake-dist_'));
    return {
        dist,
        packageJson: { ...packageJson, version: '1.2.3' } as PackageJson,
        readDistFile(file: string) {
            return fs.readFileSync(path.join(dist, file), 'utf-8');
        },
        cleanup() {
            fs.rmSync(dist, { recursive: true, force: true });
        },
    } as const;
}
