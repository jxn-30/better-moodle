/**
 * A helper class that provides methods to call functions as soon as the instance is ready
 */
export default class CanBeReady {
    #isReady = false;
    #instanceReadyCallbacks: ((...args: unknown[]) => unknown)[] = [];

    /**
     * Call the given callback when the instance is ready or immediately if it is already ready.
     * @param callback - the function that is to be called
     * @returns a promise that resolves to the return value of the callback
     */
    protected callWhenReady<Args extends unknown[], ReturnType>(
        callback: (...args: Args[]) => ReturnType
    ): Promise<ReturnType> {
        if (this.#isReady) {
            return Promise.resolve<ReturnType>(callback.call(this));
        } else {
            return new Promise<ReturnType>(resolve =>
                this.#instanceReadyCallbacks.push(() =>
                    resolve(callback.call(this))
                )
            );
        }
    }

    /**
     * Mark the instance as ready and execute all queued callbacks
     */
    protected instanceReady() {
        if (this.#isReady) return;
        this.#isReady = true;
        this.#instanceReadyCallbacks.forEach(callback => callback());
    }

    /**
     * Returns a promise that resolves once the instance is ready
     * @returns the instance itself as a Promise
     */
    awaitReady() {
        return this.callWhenReady(() => this);
    }
}
