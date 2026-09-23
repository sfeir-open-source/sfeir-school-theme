import { getErrors, getIssues, getWarnings } from '../../utils/assert.utils';
import { CheckCommand } from '../../cli';
import { checkCommandInternal } from './internal';
import { unique } from '../../utils/array.utils';

export async function checkCommand(command: CheckCommand) {
    await checkCommandInternal(command);

    const warnings = getWarnings();
    const errors = getErrors();
    const allIssues = getIssues();

    if (warnings.length > 0) {
        console.warn('\n--- WARNINGS ---');
        warnings.forEach((warning) => {
            console.warn(warning.message);
        });
    }

    if (errors.length > 0) {
        console.error('\n--- ERRORS ---');
        errors.forEach((error) => {
            console.error(error.message);
        });
    }

    if (allIssues.length > 0) {
        console.log('');
        const allRuleIds = unique(
            allIssues.map((issue) => issue.ruleId)
        ).sort();
        console.log(
            `You can call "sfeir-school-theme explain ${allRuleIds.join('|')}" to have more details.`
        );
        console.log('');
    }

    if (errors.length > 0) {
        process.exit(errors.length);
    } else {
        console.log('OK');
        process.exit(0);
    }
}
