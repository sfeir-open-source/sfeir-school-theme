import { isDefined, isNotDefinedOrEmpty } from '../utils/fp.utils';
import { ExplainCommand } from '../cli';
import readmeMd from '../README.md';

export function explainCommand({ ruleCode }: ExplainCommand) {
    if (isNotDefinedOrEmpty(ruleCode)) {
        console.error('You should specify the rule code you wanted.\n\n');
        return;
    }

    if (!readmeMd.includes('##### ' + ruleCode)) {
        console.error('You should specify an existing rule code.\n\n');
        return;
    }

    console.log(getRuleSection(ruleCode) + '\n');
}

function getRuleSection(ruleCode: string) {
    const doc = (readmeMd as string).split('\n');
    const ruleSectionIndex = doc.findIndex((row) =>
        row.startsWith('##### ' + ruleCode)
    );
    const docSectionRows = doc.slice(ruleSectionIndex);

    const ruleRows: string[] = [docSectionRows.shift()!];

    let codeBlockTag: string | null = null;
    for (const row of docSectionRows) {
        if (isDefined(codeBlockTag)) {
            ruleRows.push(row);
            if (row.startsWith(codeBlockTag!)) {
                codeBlockTag = null;
            }
            continue;
        }

        if (row.startsWith('```') || row.startsWith('~~~')) {
            ruleRows.push(row);
            codeBlockTag = row.slice(0, 3);
            continue;
        }

        if (
            row.startsWith('##### ') ||
            row.startsWith('#### ') ||
            row.startsWith('### ')
        ) {
            break;
        }

        ruleRows.push(row);
    }

    return ruleRows.join('\n');
}
