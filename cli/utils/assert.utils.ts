const ERRORS: CheckError[] = [];

export function check(
    ruleId: string,
    msg: string | { msg: string; continueCheck: boolean },
    predicate: () => boolean,
) {
    if (predicate()) {
        return true;
    } else {
        if (typeof msg === "string") {
            ERRORS.push(new CheckError(ruleId, msg));
        } else {
            const error = new CheckError(ruleId, msg.msg, msg.continueCheck);
            ERRORS.push(error);
            if (!msg.continueCheck) {
                throw error;
            }
        }
        return false;
    }
}

export class CheckError extends Error {
    constructor(public readonly ruleId: string, message: string, public continueCheck = true) {
        super(`[CheckError] ${ruleId} ${message}`);
    }
}

export function getErrors() {
    return ERRORS;
}

export function __TEST_ONLY__cleanupErrors() {
    ERRORS.splice(0, ERRORS.length);
}
