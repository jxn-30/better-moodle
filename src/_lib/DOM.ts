/**
 * Awaits the DOM to be ready and then calls the callback.
 * @param callback
 */
export const ready = (callback: () => void) => {
    if (document.readyState !== 'loading') callback();
    else {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
};
