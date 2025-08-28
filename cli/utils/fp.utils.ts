export function isDefined<T>(x: T | undefined | null): x is T {
    return x != undefined;
}

export function isNotDefined<T>(
    x: T | undefined | null,
): x is undefined | null {
    return x == undefined;
}

export function isNotEmpty<T extends { length: number }>(x: T): x is T {
    return x.length > 0;
}

export function isDefinedAndNotEmpty<T extends { length: number }>(
    x: T | undefined | null,
): x is T {
    return isDefined(x) && isNotEmpty(x);
}
