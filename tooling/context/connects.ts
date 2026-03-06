const connects = new Set<string>();

/**
 * Add one or more new URLs to the set of connects
 * @param url - the URL or a list of URLs to add
 * @returns void
 */
export const add = (url: string | string[]) =>
    Array.isArray(url) ? url.forEach(u => connects.add(u)) : connects.add(url);
/**
 * Export the set of connects as a list
 * @returns the connects as a sorted array
 */
export const list = () => connects.values().toArray().toSorted();
