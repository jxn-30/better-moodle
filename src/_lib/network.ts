import GM_fetch from '@trim21/gm-fetch';
import { PREFIX } from '@/helpers';

/**
 * Make a fetch request using the GM-API if `@connect` header exists, otherwise using native fetch
 * @param url - the url to make the fetch to
 * @param init - the fetch init
 * @returns the fetch response
 */
export const request = async (url: string, init?: RequestInit) => {
    const urlUrl = new URL(url, window.location.toString());

    const request =
        (
            __USERSCRIPT_CONNECTS__.some(connect =>
                urlUrl.hostname.includes(connect)
            )
        ) ?
            // happens via internal GM-API
            () => GM_fetch(url, init)
            // happens via native fetch
        :   () => fetch(url, init);
    return await navigator.locks.request(PREFIX(`request-${url}`), request);
};

export const NETWORK_CACHE_KEY = '_network_cache';

type NetworkMethod =
    | 'arrayBuffer'
    | 'blob'
    | 'bytes'
    | 'formData'
    | 'json'
    | 'text';
export type NetworkResponseType<Method extends NetworkMethod> = Awaited<
    ReturnType<Body[Method]>
>;
// it is known that this is not fully semantically correct, as values may have different types
// however this makes types a lot easier and still provides a sufficient type safety
export interface NetworkCache<
    Method extends NetworkMethod = NetworkMethod,
    Processed = unknown,
> {
    urls: Record<
        string,
        {
            lastUpdate: number;
            expires: number;
            value: NetworkResponseType<Method>;
        }
    >;
    processed: Record<
        string,
        { lastUpdate: number; expires: number; value: Processed }
    >;
}

export interface CachedResponse<ResultType> {
    cached: boolean;
    lastUpdate: number;
    value: ResultType;
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
const unlockedCachedRequest = <
    Method extends NetworkMethod,
    ResponseType extends NetworkResponseType<Method>,
    ResultType = ResponseType,
>(
    url: string,
    cacheDuration: number,
    method: Method,
    preprocess?: (result: ResponseType) => ResultType,
    init?: RequestInit
): Promise<CachedResponse<ResultType>> => {
    const cache = GM_getValue<NetworkCache<Method, ResultType>>(
        NETWORK_CACHE_KEY
    ) ?? { urls: {}, processed: {} };

    const cacheKey =
        preprocess ?
            `${preprocess.length}:${preprocess.toString().length}:${url}`
        :   url;

    const cacheKeyLastUpdate = cache.processed[cacheKey]?.lastUpdate ?? 0;
    const cacheUrlLastUpdate = cache.urls[url]?.lastUpdate ?? 0;

    // We do have a non-outdated cached version
    // => return that
    if (preprocess && cacheKeyLastUpdate + cacheDuration > Date.now()) {
        return Promise.resolve({
            cached: true,
            lastUpdate: cacheKeyLastUpdate,
            value: cache.processed[cacheKey].value,
        });
    }

    // We do have a non-outdated cached version of the base URL
    if (cacheUrlLastUpdate + cacheDuration > Date.now()) {
        // => do the preprocessing, store and return the result
        if (preprocess) {
            const result = preprocess(cache.urls[url].value);
            cache.processed[cacheKey] = {
                lastUpdate: cache.urls[url].lastUpdate,
                expires: cache.urls[url].lastUpdate + cacheDuration,
                value: result,
            };
            GM_setValue(NETWORK_CACHE_KEY, cache);
            return Promise.resolve({
                cached: true,
                lastUpdate: cacheUrlLastUpdate,
                value: result,
            });
        }
        // => no preprocessing needs to be done
        else {
            return Promise.resolve({
                cached: true,
                lastUpdate: cacheUrlLastUpdate,
                value: cache.urls[url].value,
            });
        }
    }

    // We don't have any up-to-date cache at all
    // => fetch, preprocess and store all results, return final result
    return request(url, init)
        .then(res => res[method]())
        .then((result: ResponseType) => {
            const value = preprocess?.(result) ?? result;
            const lastUpdate = Date.now();
            if (cacheDuration) {
                const expires = lastUpdate + cacheDuration;
                cache.urls[url] = { lastUpdate, expires, value: result };
                if (preprocess) {
                    cache.processed[cacheKey] = { lastUpdate, expires, value };
                }
                GM_setValue(NETWORK_CACHE_KEY, cache);
            }
            return { cached: false, lastUpdate, value };
        });
};

/**
 * Caches the result of a request within GM storage.
 * Ensures that concurrent requests to an URL happen sequentally
 * @param url - the url to make the fetch to
 * @param cacheDuration - how long to cache the request in ms
 * @param method - the body method to work with the response
 * @param preprocess - an optional method to process the result
 * @param init - the fetch init
 * @returns the fetch response
 */
export const cachedRequest = async <
    Method extends NetworkMethod,
    ResponseType extends NetworkResponseType<Method>,
    ResultType = ResponseType,
>(
    url: string,
    cacheDuration: number,
    method: Method,
    preprocess?: (result: ResponseType) => ResultType,
    init?: RequestInit
): Promise<CachedResponse<ResultType>> =>
    await navigator.locks.request(PREFIX(`cached_request-${url}`), () =>
        unlockedCachedRequest(url, cacheDuration, method, preprocess, init)
    );

/**
 * Fetches a document from the given path and returns it as a Document object
 * @param path - the path to fetch the document from
 * @param cacheDuration - how long to cache the document
 * @returns a promise that resolves to the fetched document
 */
export const getDocument = (
    path: string,
    cacheDuration = 0
): Promise<CachedResponse<Document>> =>
    cachedRequest(path, cacheDuration, 'text').then(res => ({
        ...res,
        value: new DOMParser().parseFromString(res.value, 'text/html'),
    }));

/**
 * Creates the URL for parsing ics by the Better-Moodle server infrastructure.
 * @param category - the category this link is for.
 * @returns a full valid URL that matches the criteria
 */
export const icsUrl = (category: 'semesterzeiten' | 'events') =>
    `https://${__ICS_PARSER_DOMAIN__}/${category}/${__UNI__}`;
