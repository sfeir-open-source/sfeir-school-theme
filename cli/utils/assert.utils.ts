const ERRORS: CheckError[] = [];

export function check(
    msg: string | { msg: string; continueCheck: boolean },
    predicate: () => boolean,
) {
    if (!predicate()) {
        if (typeof msg === "string") {
            ERRORS.push(new CheckError(msg));
        } else {
            const error = new CheckError(msg.msg, msg.continueCheck);
            ERRORS.push(error);
            if (!msg.continueCheck) {
                throw error;
            }
        }
    }
}

export class CheckError extends Error {
    constructor(message: string, public continueCheck = true) {
        super("[CheckError] " + message);
    }
}

export function getErrors() {
    return ERRORS;
}
