interface ExtendedXHRWithUrl extends XMLHttpRequest {
    _url?: string;
}

/**
 * Creates a fetch interceptor that monitors requests/responses for specific triggers
 * @param triggers - String or array of strings to match in response bodies or URLs
 * @param callback - Function to invoke when a trigger is detected
 * @returns A function that sets up the interceptor on a given window object
 */
export const createFetchInterceptor = (
    triggers: string | string[],
    callback: () => void
) => {
    const triggerList = Array.isArray(triggers) ? triggers : [triggers];

    /**
     * Sets up fetch interception on the provided window
     * @param targetWindow - The window object to hook into
     */
    return (targetWindow: Window & typeof globalThis): void => {
        const originalFetch = targetWindow.fetch;

        /**
         * Intercepts fetch requests to detect specified triggers
         * @param input - The request URL or Request object
         * @param init - Optional request initialization options
         * @returns A promise that resolves to the fetch response
         */
        targetWindow.fetch = function (
            input: RequestInfo | URL,
            init?: RequestInit
        ): Promise<Response> {
            // Normalize the input to a string URL
            const url =
                typeof input === 'string' ? input
                : input instanceof URL ? input.href
                : input instanceof Request ? input.url
                : String(input);

            // Call original fetch and handle response
            const fetchPromise = originalFetch.call(this, input, init);

            return fetchPromise.then((response: Response) => {
                // Only process successful responses
                if (!response.ok) return response;

                const cloned = response.clone();
                void cloned
                    .text()
                    .then((bodyText: string) => {
                        const lowerUrl = url.toLowerCase();
                        const shouldInvalidate = triggerList.some(
                            trigger =>
                                bodyText.includes(trigger) ||
                                lowerUrl.includes(trigger.toLowerCase())
                        );

                        if (shouldInvalidate) {
                            callback();
                        }
                    })
                    .catch((error: unknown) => {
                        console.error(
                            '[Better Moodle] Failed to read fetch response body',
                            error instanceof Error ?
                                error.message
                            :   String(error)
                        );
                    });

                return response;
            });
        };
    };
};

/**
 * Creates an XMLHttpRequest interceptor that monitors requests/responses for specific triggers
 * @param triggers - String or array of strings to match in response bodies or URLs
 * @param callback - Function to invoke when a trigger is detected
 * @returns A function that sets up the interceptor on a given window object
 */
export const createXHRInterceptor = (
    triggers: string | string[],
    callback: () => void
) => {
    const triggerList = Array.isArray(triggers) ? triggers : [triggers];

    /**
     * Sets up XMLHttpRequest interception on the provided window
     * @param targetWindow - The window object to hook into
     */
    return (targetWindow: Window & typeof globalThis): void => {
        // Not clean, but capturing unbound methods is necessary for method interception.
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const originalXHROpen = targetWindow.XMLHttpRequest.prototype.open;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const originalXHRSend = targetWindow.XMLHttpRequest.prototype.send;

        /**
         * Helper to invoke the original XMLHttpRequest.open method
         * @param xhr - The XMLHttpRequest instance
         * @param method - The HTTP method
         * @param url - The request URL
         * @param async - Whether the request should be asynchronous
         * @param username - Optional username for authentication
         * @param password - Optional password for authentication
         */
        const callOriginalXHROpen = (
            xhr: ExtendedXHRWithUrl,
            method: string,
            url: string | URL,
            async?: boolean,
            username?: string | null,
            password?: string | null
        ): void => {
            Reflect.apply(originalXHROpen, xhr, [
                method,
                url,
                async ?? true,
                username ?? undefined,
                password ?? undefined,
            ]);
        };

        /**
         * Helper to invoke the original XMLHttpRequest.send method
         * @param xhr - The XMLHttpRequest instance
         * @param body - Optional request body
         */
        const callOriginalXHRSend = (
            xhr: ExtendedXHRWithUrl,
            body?: Document | XMLHttpRequestBodyInit | null
        ): void => {
            Reflect.apply(originalXHRSend, xhr, [body]);
        };

        /**
         * Creates a load event handler that checks for triggers
         * @param xhr - The XMLHttpRequest instance
         * @returns The load event handler function
         */
        const createLoadHandler = (xhr: ExtendedXHRWithUrl): (() => void) => {
            return (): void => {
                try {
                    const responseText = xhr.responseText ?? '';
                    const trackedUrl = xhr._url ?? '';

                    const shouldInvalidate = triggerList.some(
                        trigger =>
                            trackedUrl.includes(trigger) ||
                            responseText.includes(trigger)
                    );

                    if (shouldInvalidate) {
                        callback();
                    }
                } catch (error: unknown) {
                    console.error(
                        '[Better Moodle] Error checking XHR response for triggers',
                        error instanceof Error ? error.message : String(error)
                    );
                }
            };
        };

        /**
         * Overrides XMLHttpRequest.open to track the URL and listen for responses
         * @param method - The HTTP method
         * @param url - The request URL
         * @param async - Whether the request should be asynchronous
         * @param username - Optional username for authentication
         * @param password - Optional password for authentication
         */
        targetWindow.XMLHttpRequest.prototype.open = function (
            this: ExtendedXHRWithUrl,
            method: string,
            url: string | URL,
            async?: boolean,
            username?: string | null,
            password?: string | null
        ): void {
            const xhrUrl = String(url).toLowerCase();
            this._url = xhrUrl;

            callOriginalXHROpen(this, method, url, async, username, password);
            this.addEventListener('load', createLoadHandler(this));
        };

        /**
         * Overrides XMLHttpRequest.send to ensure proper forwarding
         * @param body - Optional request body
         */
        targetWindow.XMLHttpRequest.prototype.send = function (
            this: ExtendedXHRWithUrl,
            body?: Document | XMLHttpRequestBodyInit | null
        ): void {
            callOriginalXHRSend(this, body);
        };
    };
};
