import { createHash } from 'node:crypto';

const requires = new Set<string>();

/**
 * Calculates a SHA512 hash
 * @param content - the string to calculate the hash of
 * @returns the hash of the content
 */
export const getHash = (content: string | Buffer) =>
    createHash('sha512').update(content).digest('hex');

/**
 * @param url
 * @param hashContent
 */
export const getUrl = (
    url: string,
    hashContent: false | string | Buffer = false
) => {
    if (!hashContent) return url;
    else return `${url}#sha512=${getHash(hashContent)}`;
};

/**
 * Adds a url with optional hash to the list of requires
 * @param url - the url to add
 * @param hashContent - wether to omit the cache or the content to create the hash of otherwise
 */
export const add = (
    url: string,
    hashContent: false | string | Buffer = false
) => {
    requires.add(getUrl(url, hashContent));
};
/**
 * Exports the set of requires as a list
 * @returns the requires as a sorted array
 */
export const list = () => requires.values().toArray().toSorted();
