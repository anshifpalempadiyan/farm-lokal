"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCacheKey = void 0;
const buildCacheKey = (prefix, query) => {
    const sortedKeys = Object.keys(query).sort();
    const normalized = sortedKeys.reduce((acc, key) => {
        acc[key] = query[key];
        return acc;
    }, {});
    return `${prefix}:${JSON.stringify(normalized)}`;
};
exports.buildCacheKey = buildCacheKey;
