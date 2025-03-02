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

/**
 * Fetches a document from the given path and returns it as a Document object
 * @param path - the path to fetch the document from
 * @returns a promise that resolves to the fetched document
 */
export const getDocument = (path: string): Promise<Document> =>
    request(path)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'));
