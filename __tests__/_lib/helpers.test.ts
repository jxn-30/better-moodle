import {
    domID,
    getSettingKey,
    githubPath,
    isDashboard,
    isNewInstallation,
    PREFIX,
    rawGithubPath,
} from '@/helpers';
import { expect, test } from 'vitest';

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
// TODO => externalize?
// endsection mdToHtml

// section htmlToElements
// TODO
// endsection htmlToElements

// section debounce
// how to test this?
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
