export type Severity = 'error' | 'warning';

const ISSUES: CheckError[] = [];

export function check(
    ruleId: string,
    msg: string | { msg: string; continueCheck: boolean },
    predicate: () => boolean | { result: boolean; severity: Severity },
    severity: Severity = 'error'
) {
    const result = predicate();
    if (
        (typeof result === 'boolean' && result) ||
        (typeof result === 'object' && result.result)
    ) {
        return true;
    } else {
        const finalSeveriry =
            typeof result === 'object' ? result.severity : severity;
        if (typeof msg === 'string') {
            ISSUES.push(new CheckError(ruleId, msg, true, finalSeveriry));
        } else {
            const error = new CheckError(
                ruleId,
                msg.msg,
                msg.continueCheck,
                finalSeveriry
            );
            ISSUES.push(error);
            if (!msg.continueCheck) {
                throw error;
            }
        }
        return false;
    }
}

export class CheckError extends Error {
    constructor(
        public readonly ruleId: string,
        message: string,
        public continueCheck = true,
        public readonly severity: Severity = 'error'
    ) {
        const prefix = severity === 'error' ? '[CheckError]' : '[CheckWarning]';
        super(`${prefix} ${ruleId} ${message}`);
    }
}

export function getIssues() {
    return ISSUES;
}

export function getErrors() {
    return ISSUES.filter((issue) => issue.severity === 'error');
}

export function getWarnings() {
    return ISSUES.filter((issue) => issue.severity === 'warning');
}

export function __TEST_ONLY__cleanupErrors() {
    ISSUES.splice(0, ISSUES.length);
}
