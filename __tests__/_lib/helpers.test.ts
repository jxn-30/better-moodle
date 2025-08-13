import * as vitest from 'vitest';
import {
    debounce,
    domID,
    getSettingKey,
    githubPath,
    isDashboard,
    isNewInstallation,
    PREFIX,
    rawGithubPath,
} from '@/helpers';

const { describe, expect, test, vi } = vitest;

// first of all, we want to test if tests are working :)
test('1 + 2 = 3', () => expect(1 + 2).toBe(3));

// now, create some basic tests as a proof of concept
// intelligent testing strategies are to be found in the future

// section PREFIX
test('a prefixed string should start with the defined prefix', () =>
    expect(PREFIX('some string')).toStartWith(__PREFIX__));
test('a prefixed string should contain the original string somewhere', () =>
    expect(PREFIX('abcdefg')).toContain('abcdefg'));
// endsection PREFIX

// section getSettingKey
test('a setting key should contain the setting id somewhere', () =>
    expect(getSettingKey('abcdefg')).toContain('abcdefg'));
// endsection getSettingKey

// section domID
test('a domID should start with the prefix', () =>
    expect(domID('abcdefg')).toStartWith(__PREFIX__));
// endsection domID

// section githubPath
test('a github path should be a valid url', () =>
    expect(githubPath('/CHANGELOG.md')).toBeAValidURL());
// endsection githubPath

// section rawGithubPath
test('a raw github path should be a valid url', () =>
    expect(rawGithubPath('/CHANGELOG.md')).toBeAValidURL());
// endsection rawGithubPath

// section mdID
// TODO
// endsection mdID

// section mdToHtml
// is tested in ./helpers.ts/mdToHtml.test.ts
// endsection mdToHtml

// section htmlToElements
// TODO
// endsection htmlToElements

// section debounce
describe('debounce', () => {
    vitest.beforeEach(() => vi.useFakeTimers());
    vitest.afterEach(() => vi.useRealTimers());

    test('function should be run once (100ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(1);
    });

    test('function should be run twice (100ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        for (let i = 0; i < 100; i++) debounced();
        vi.advanceTimersByTime(101);
        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(2);
    });

    test('function should be run once (4726ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 4726);

        for (let i = 0; i < 100; i++) debounced();
        vi.advanceTimersByTime(4700);
        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(1);
    });

    test('function should be run twice (4726ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 4726);

        for (let i = 0; i < 100; i++) debounced();
        vi.advanceTimersByTime(4727);
        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(2);
    });
});
// endsection debounce

// section animate
// how to test this?
// endsection animate

// section isLoggedIn
// how can we test this in here?
// endsection isLoggedIn

// section isDashboard
test('constant isDashboard must be a boolean', () =>
    expect(isDashboard).toBeABoolean());
// endsection isDashboard

// section isNewInstallation
test('constant isNewInstallation must be a boolean', () =>
    expect(isNewInstallation).toBeABoolean());
// endsection isNewInstallation

// section mdlJSComplete
// how can we test this in here?
// endsection mdlJSComplete
