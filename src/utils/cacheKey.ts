export const buildCacheKey = (
    prefix: string,
    query: Record<string, any>
): string => {
    const sortedKeys = Object.keys(query).sort();

    const normalized = sortedKeys.reduce<Record<string, any>>((acc, key) => {
        acc[key] = query[key];
        return acc;
    }, {});

    return `${prefix}:${JSON.stringify(normalized)}`;
};
