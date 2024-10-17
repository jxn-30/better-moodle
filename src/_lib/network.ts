/**
 * Make a fetch request on internal requests and use the GM-API for external requests
 * @param args - Arguments to pass to fetch
 * TODO: Use GM-API for external requests
 * @returns the fetch response
 */
export const request: typeof fetch = (...args) => fetch(...args);

/**
 * Fetches a document from the given path and returns it as a Document object
 * @param path - the path to fetch the document from
 * @returns a promise that resolves to the fetched document
 */
export const getDocument = (path: string): Promise<Document> =>
    fetch(path)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'));
