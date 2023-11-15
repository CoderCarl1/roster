type RemoveProperties<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};

export function removePropertiesFromObject<T, K extends keyof T>(
    obj: T,
    ...keys: K[]
): RemoveProperties<T, K> {
    const copy = { ...obj };
    keys.forEach((key) => {
        delete copy[key];
    });
    return copy;
}
