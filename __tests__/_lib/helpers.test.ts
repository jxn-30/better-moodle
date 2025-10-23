import * as vitest from 'vitest';
import {
    debounce,
    domID,
    getSettingKey,
    githubPath,
    htmlToElements,
    isDashboard,
    isNewInstallation,
    mdID,
    PREFIX,
    rawGithubPath,
} from '@/helpers';

const { describe, expect, it, vi } = vitest;

// now, create some basic tests as a proof of concept
// intelligent testing strategies are to be found in the future

// section PREFIX
describe('PREFIX', () => {
    it('a prefixed string should start with the defined prefix', () =>
        expect(PREFIX('some string')).toStartWith(__PREFIX__));
    it('a prefixed string should contain the original string somewhere', () =>
        expect(PREFIX('abcdefg')).toContain('abcdefg'));
});
// endsection PREFIX

// section getSettingKey
describe('getSettingKey', () => {
    it('returns the correct setting key for a given id', () => {
        expect(getSettingKey('exampleId')).toBe('settings.exampleId');
    });

    it('works with a short id', () => {
        expect(getSettingKey('abc')).toBe('settings.abc');
    });

    it('works with a long id', () => {
        expect(getSettingKey('this-is-a-long-id')).toBe(
            'settings.this-is-a-long-id'
        );
    });

    it('works with an id with special characters', () => {
        expect(getSettingKey('example!@#')).toBe('settings.example!@#');
    });
});
// endsection getSettingKey

// section domID
describe('domID', () => {
    it('a domID should start with the prefix', () =>
        expect(domID('abcdefg')).toStartWith(__PREFIX__));

    it('transforms a string into a valid DOM ID', () => {
        expect(domID('foo bar')).toEndWith('foo_bar');
    });

    it('replaces special characters with dashes', () => {
        expect(domID('foo!bar')).toEndWith('foo-bar');
    });

    it('removes double and single quotes', () => {
        expect(domID('"foo\'')).toEndWith('foo');
    });

    it('transforms a string with special characters and spaces', () => {
        expect(domID('foo!bar baz')).toEndWith('foo-bar_baz');
    });

    // CSS interface (https://developer.mozilla.org/en-US/docs/Web/API/CSS)
    // is not implemented in jsdom yet (https://github.com/jsdom/jsdom/issues/3919#issuecomment-3287409132)
    /*
    it('is a valid CSS identifier', () => {
        expect(domID('"foo\'!bar baz')).toBe(
            CSS.escape(domID('"foo\'!bar baz'))
        );
    });
    */
});
// endsection domID

// section githubPath
describe('githubPath', () => {
    it('a github path should be a valid url', () =>
        expect(githubPath('/CHANGELOG.md')).toBeAValidURL());
});
// endsection githubPath

// section rawGithubPath
describe('rawGithubPath', () => {
    it('a raw github path should be a valid url', () =>
        expect(rawGithubPath('/CHANGELOG.md')).toBeAValidURL());
});
// endsection rawGithubPath

// section mdID
describe('mdID', () => {
    it('should use the text content in the ID', () => {
        expect(mdID('# Heading no. 1')).toEndWith('Heading_no-_1');
    });
});
// endsection mdID

// section mdToHtml
// is tested in ./helpers.ts/mdToHtml.test.ts
// endsection mdToHtml

// section htmlToElements
describe('htmlToElements', () => {
    it('returns a single element for a simple HTML string', () => {
        const html = '<p>Hello World</p>';
        const elements = htmlToElements(html);
        expect(elements.length).toBe(1);
        expect(elements[0].tagName).toBe('P');
        expect(elements[0].textContent).toBe('Hello World');
    });

    it('returns multiple elements for a multi-element HTML string', () => {
        const html = '<li>One</li><li>Two</li><li>Three</li>';
        const elements = htmlToElements(html);
        expect(elements.length).toBe(3);
        expect(elements[0].tagName).toBe('LI');
        expect(elements[1].tagName).toBe('LI');
        expect(elements[2].tagName).toBe('LI');
    });

    it('returns an empty array for an empty HTML string', () => {
        const html = '';
        const elements = htmlToElements(html);
        expect(elements.length).toBe(0);
    });
});
// endsection htmlToElements

// section debounce
describe('debounce', () => {
    vitest.beforeEach(() => vi.useFakeTimers());
    vitest.afterEach(() => vi.useRealTimers());

    it('function should be run once (100ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(1);
    });

    it('function should be run twice (100ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        for (let i = 0; i < 100; i++) debounced();
        vi.advanceTimersByTime(101);
        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(2);
    });

    it('function should be run once (4726ms)', () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 4726);

        for (let i = 0; i < 100; i++) debounced();
        vi.advanceTimersByTime(4700);
        for (let i = 0; i < 100; i++) debounced();

        vi.runAllTimers();

        expect(fn).toBeCalledTimes(1);
    });

    it('function should be run twice (4726ms)', () => {
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
it('constant isDashboard must be a boolean', () =>
    expect(isDashboard).toBeABoolean());
// endsection isDashboard

// section isNewInstallation
it('constant isNewInstallation must be a boolean', () =>
    expect(isNewInstallation).toBeABoolean());
// endsection isNewInstallation

// section mdlJSComplete
// how can we test this in here?
// endsection mdlJSComplete
