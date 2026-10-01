import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression harness for the demo deck. See tests/visual/README.md.
 *
 * Port 4243 on purpose: 4242 is `npm run serve` (live-reload + `--open`), which other
 * projects and humans use. The CI server is `serve:ci` (no browser, no CSS inject,
 * watch pinned to index.html so a rebuild mid-run does not reload the page).
 */
export const VISUAL_PORT = 4243;
export const VISUAL_BASE_URL = `http://localhost:${VISUAL_PORT}`;

export default defineConfig({
    testDir: './tests/visual',
    testMatch: /.*\.pw\.ts$/,
    outputDir: './tests/visual/test-results',
    snapshotPathTemplate:
        '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never', outputFolder: './tests/visual/playwright-report' }]]
        : [['list'], ['html', { open: 'never', outputFolder: './tests/visual/playwright-report' }]],
    timeout: 15 * 60 * 1000,
    expect: {
        timeout: 10_000,
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.002,
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
        },
    },
    use: {
        baseURL: VISUAL_BASE_URL,
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        trace: 'retain-on-failure',
        screenshot: 'off',
        video: 'off',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
        },
    ],
    webServer: {
        command: 'npm run prepare-demo && npm run serve:ci',
        url: `${VISUAL_BASE_URL}/demo/index.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
