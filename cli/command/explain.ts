import { ExplainCommand } from '../cli';
import { isNotDefinedOrEmpty } from '../utils/fp.utils';
import readmeMd from '../README.md';

export function explainCommand({ ruleCode }: ExplainCommand) {
    if (isNotDefinedOrEmpty(ruleCode)) {
        console.error('You should specify the rule code you wanted.\n\n')
        return;
    }

    if (!readmeMd.includes('##### ' + ruleCode)) {
        console.error('You should specify an existing rule code.\n\n')
        return;
    }

    const doc = (readmeMd as string).split('\n');
    const ruleSectionIndex = doc.findIndex(row => row.startsWith('##### ' + ruleCode));
    let docSection = doc.slice(ruleSectionIndex);
    docSection = docSection.slice(0, docSection.slice(1).findIndex(row => row.startsWith('##### ')));
    console.log(docSection.join('\n') + '\n');
}
