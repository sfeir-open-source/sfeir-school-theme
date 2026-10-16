import { afterEach, describe, expect, it, vi } from 'vitest';
import { helpCommand } from './help';

describe(helpCommand.name, () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('mentions the sibling migrate and cleanup commands', () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {});

        helpCommand();

        const output = log.mock.calls.flat().join('\n');
        expect(output).toContain('sfeir-school-theme-migrate --help');
        expect(output).toContain('sfeir-school-theme-cleanup');
    });
});
