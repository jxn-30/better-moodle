import * as vitest from 'vitest';
import { SimpleReady } from '@/CanBeReady';

const { afterEach, describe, expect, it, vi } = vitest;

const mock = vi.fn();

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

    it('callbacks can be called immediately if the instance is already ready', () => {
        const instance = new SimpleReady();
        instance.ready();
        void instance.awaitReady().then(mock);
        // small delay to give it time to actually finish
        setTimeout(() => expect(mock).toHaveBeenCalled(), 100);
    });

    it('instance can be awaited', async () => {
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
});
