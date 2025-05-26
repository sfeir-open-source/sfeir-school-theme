export function isDefined<T>(x: T | undefined | null): x is T {
    return x != undefined;
}

export function isNotDefined<T>(
    x: T | undefined | null,
): x is undefined | null {
    return x == undefined;
}
