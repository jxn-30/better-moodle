import * as vitest from 'vitest';
import { SimpleReady } from '#lib/CanBeReady';

const { afterEach, describe, expect, it, vi } = vitest;

const mock = vi.fn();

// section SimpleReady
describe('SimpleReady', () => {
    afterEach(() => vi.resetAllMocks());

    it('instance is not ready by default', () => {
        expect(new SimpleReady().instanceIsReady).toBe(false);
    });

    it('instance can be marked as ready', () => {
        const instance = new SimpleReady();
        instance.ready();
        expect(instance.instanceIsReady).toBe(true);
    });

    it('callbacks can be called when the instance is ready', async () => {
        const instance = new SimpleReady();
        const called = instance.awaitReady().then(mock);
        instance.ready();
        await called;
        expect(mock).toHaveBeenCalled();
    });

    it('callbacks are not called before the instance is ready', async () => {
        const instance = new SimpleReady();
        const called = instance.awaitReady().then(mock);
        expect(mock).not.toHaveBeenCalled();
        instance.ready();
        await called;
        expect(mock).toHaveBeenCalled();
    });

    it('callbacks are called immediately if the instance is already ready', async () => {
        const instance = new SimpleReady();
        instance.ready();
        // awaiting directly (instead of a fixed setTimeout) makes this
        // deterministic and avoids a flaky race condition
        await instance.awaitReady().then(mock);
        expect(mock).toHaveBeenCalled();
    });

    it('instance can be awaited and resolves to itself', async () => {
        const instance = new SimpleReady();
        instance.ready();
        expect(await instance.awaitReady()).toBe(instance);
    });

    it('instance is not awaited before it is ready', async () => {
        const instance = new SimpleReady();
        let awaited = null;
        void instance.awaitReady().then(result => (awaited = result));
        expect(awaited).toBe(null);
        instance.ready();
        await instance.awaitReady();
        expect(awaited).toBe(instance);
    });

    it('marking the instance as ready twice does not call the callbacks twice', async () => {
        const instance = new SimpleReady();
        const called1 = instance.awaitReady().then(mock);
        instance.ready();
        await called1;
        expect(mock).toHaveBeenCalledTimes(1);
        instance.ready();
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('calls multiple independently queued callbacks in order once ready', async () => {
        const instance = new SimpleReady();
        const order: number[] = [];

        const first = instance.awaitReady().then(() => order.push(1));
        const second = instance.awaitReady().then(() => order.push(2));
        const third = instance.awaitReady().then(() => order.push(3));

        instance.ready();
        await Promise.all([first, second, third]);

        expect(order).toEqual([1, 2, 3]);
    });

    it('resolves multiple pending awaitReady() calls with the same instance', async () => {
        const instance = new SimpleReady();
        const pending = Promise.all([
            instance.awaitReady(),
            instance.awaitReady(),
        ]);
        instance.ready();
        const [first, second] = await pending;
        expect(first).toBe(instance);
        expect(second).toBe(instance);
    });

    it('two separate instances track their ready state independently', async () => {
        const instanceA = new SimpleReady();
        const instanceB = new SimpleReady();

        instanceA.ready();

        await instanceA.awaitReady();

        expect(instanceA.instanceIsReady).toBe(true);
        expect(instanceB.instanceIsReady).toBe(false);
    });

    it('propagates a rejection from a callback registered via awaitReady-derived chains', async () => {
        const instance = new SimpleReady();
        const error = new Error('callback failed');
        const rejected = instance
            .awaitReady()
            .then(() => {
                throw error;
            })
            .catch((err: unknown) => err);
        instance.ready();
        await expect(rejected).resolves.toBe(error);
    });
});
// endsection SimpleReady
