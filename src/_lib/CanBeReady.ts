/**
 * A helper class that provides methods to call functions as soon as the instance is ready
 */
export default abstract class CanBeReady {
    #instanceIsReady = false;
    #instanceReadyCallbacks: ((...args: unknown[]) => unknown)[] = [];

    /**
     * Call the given callback when the instance is ready or immediately if it is already ready.
     * @param callback - the function that is to be called
     * @returns a promise that resolves to the return value of the callback
     */
    protected callWhenReady<Args extends unknown[], ReturnType>(
        callback: (...args: Args[]) => ReturnType
    ): Promise<ReturnType> {
        if (this.#instanceIsReady) {
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
     * Gets the instance's ready state
     * @returns the instance's ready state
     */
    get instanceIsReady() {
        return this.#instanceIsReady;
    }

    /**
     * Mark the instance as ready and execute all queued callbacks
     */
    protected instanceReady() {
        if (this.#instanceIsReady) return;
        this.#instanceIsReady = true;
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

/**
 * A simple implementation of CanBeReady
 */
export class SimpleReady extends CanBeReady {
    /**
     * Mark the instance as ready
     */
    ready() {
        this.instanceReady();
    }
}
