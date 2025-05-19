import GM_fetch from '@trim21/gm-fetch';

/**
 * Make a fetch request using the GM-API if @connect header exists, otherwise using native fetch
 * @param url - the url to make the fetch to
 * @param init - the fetch init
 * @returns the fetch response
 */
export const request = (url: string, init?: RequestInit) => {
    const urlUrl = new URL(url, window.location.toString());

    // happens via internal GM-API
    if (
        __USERSCRIPT_CONNECTS__.some(connect =>
            urlUrl.hostname.includes(connect)
        )
    ) {
        return GM_fetch(url, init);
    } else {
        // happens via native fetch
        return fetch(url, init);
    }
};

export const NETWORK_CACHE_KEY = '_network_cache';

type NetworkMethod =
    | 'arrayBuffer'
    | 'blob'
    | 'bytes'
    | 'formData'
    | 'json'
    | 'text';
type NetworkResponseType<Method extends NetworkMethod> = Awaited<
    ReturnType<Body[Method]>
>;
// it is known that this is not fully semantically correct, as values may have different types
// however this makes types a lot easier and still provides a sufficient type safety
interface NetworkCache<Method extends NetworkMethod, Processed = unknown> {
    urls: Record<
        string,
        { lastUpdate: number; value: NetworkResponseType<Method> }
    >;
    processed: Record<string, { lastUpdate: number; value: Processed }>;
}

/**
 * Caches the result of a request within GM storage.
 * @param url - the url to make the fetch to
 * @param cacheDuration - how long to cache the request in ms
 * @param method - the body method to work with the response
 * @param preprocess - an optional method to process the result
 * @param init - the fetch init
 * @returns the fetch response
 */
export const cachedRequest = <
    ResultType,
    Method extends NetworkMethod,
    ResponseType extends NetworkResponseType<Method>,
>(
    url: string,
    cacheDuration: number,
    method: Method,
    preprocess?: (result: ResponseType) => ResultType,
    init?: RequestInit
): Promise<ResultType> => {
    const cache = GM_getValue<NetworkCache<Method, ResultType>>(
        NETWORK_CACHE_KEY
    ) ?? { urls: {}, processed: {} };

    const cacheKey =
        preprocess ?
            `${preprocess.length}:${preprocess.toString().length}:${url}`
        :   url;

    // We do have a non-outdated cached version
    // => return that
    if (
        preprocess &&
        (cache.processed[cacheKey]?.lastUpdate ?? 0) + cacheDuration >
            Date.now()
    ) {
        return Promise.resolve(cache.processed[cacheKey].value);
    }

    // We do have a non-outdated cached version of the base URL
    if ((cache.urls[url]?.lastUpdate ?? 0) + cacheDuration > Date.now()) {
        // => do the preprocessing, store and return the result
        if (preprocess) {
            const result = preprocess(cache.urls[url].value);
            cache.processed[cacheKey] = {
                lastUpdate: cache.urls[url].lastUpdate,
                value: result,
            };
            GM_setValue(NETWORK_CACHE_KEY, cache);
            return Promise.resolve(result);
        }
        // => no preprocessing needs to be done
        else return Promise.resolve(cache.urls[url].value);
    }

    // We don't have any up-to-date cache at all
    // => fetch, preprocess and store all results, return final result
    return request(url, init)
        .then(res => res[method]())
        .then((result: ResponseType) => {
            const now = Date.now();
            cache.urls[url] = { lastUpdate: now, value: result };
            const value = preprocess?.(result) ?? result;
            cache.processed[cacheKey] = { lastUpdate: now, value };
            GM_setValue(NETWORK_CACHE_KEY, cache);
            return value;
        });
};

/**
 * Fetches a document from the given path and returns it as a Document object
 * @param path - the path to fetch the document from
 * @returns a promise that resolves to the fetched document
 */
export const getDocument = (path: string): Promise<Document> =>
    request(path)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'));

/**
 * Creates the URL for parsing ics by the Better-Moodle server infrastructure.
 * @param category - the category this link is for.
 * @returns a full valid URL that matches the criteria
 */
export const icsUrl = (category: 'semesterzeiten' | 'events') =>
    `https://${__ICS_PARSER_DOMAIN__}/${category}/${__UNI__}`;
