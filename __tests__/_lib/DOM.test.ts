import { describe, expect, it } from 'vitest';
import { getDocumentFragmentHtml, getHtml } from '@/DOM';

describe('getDocumentFragmentHtml & getHtml for Fragments', () => {
    // A basic a test
    it('returns the HTML of the document fragment', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode('Hello World'));
        const html = 'Hello World';
        expect(getDocumentFragmentHtml(fragment)).toBe(html);
        expect(getHtml(fragment)).toBe(html);
    });

    // Fragment with Multiple Nodes
    it('returns the HTML of a fragment with multiple nodes', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement('p'));
        fragment.appendChild(document.createElement('img'));
        const html = '<p></p><img>';
        expect(getDocumentFragmentHtml(fragment)).toBe(html);
        expect(getHtml(fragment)).toBe(html);
    });

    // Empty fragment
    it('returns an empty string for an empty fragment', () => {
        const fragment = document.createDocumentFragment();
        expect(getDocumentFragmentHtml(fragment)).toBe('');
        expect(getHtml(fragment)).toBe('');
    });

    // Testing with a Realistic Fragment
    it('works with a realistic fragment', () => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createElement('ul'));
        fragment.firstChild?.appendChild(document.createElement('li'));
        fragment.firstChild?.appendChild(document.createElement('li'));
        const html = '<ul><li></li><li></li></ul>';
        expect(getDocumentFragmentHtml(fragment)).toBe(html);
        expect(getHtml(fragment)).toBe(html);
    });
});

describe('getHtml for other elements', () => {
    it('returns the outerHTML of a regular element', () => {
        const div = document.createElement('div');
        div.textContent = 'Hello World';
        expect(getHtml(div)).toBe('<div>Hello World</div>');
    });

    it('works with a realistic element', () => {
        const div = document.createElement('div');
        div.appendChild(document.createElement('ul'));
        div.firstChild?.appendChild(document.createElement('li'));
        div.firstChild?.appendChild(document.createElement('li'));
        expect(getHtml(div)).toBe('<div><ul><li></li><li></li></ul></div>');
    });
});
