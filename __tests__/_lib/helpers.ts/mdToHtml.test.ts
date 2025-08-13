import { type Awaitable, expect, test } from 'vitest';
import { htmlToElements, mdToHtml } from '@/helpers';

interface TestCase {
    description: string;
    md: string;
    elCount: number;
    expects: ((...elements: Element[]) => Awaitable<void>)[];
}

const testCases: TestCase[] = [
    {
        description: 'Simple paragraph',
        md: 'Hello world!',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el => expect(el.textContent).toBe('Hello world!'),
        ],
    },
    {
        description: 'Simple paragrap with linebreak',
        md: 'Hello \nworld!',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el => expect(el.textContent).toBe('Hello \nworld!'),
        ],
    },
    {
        description: 'Multiple paragraphs',
        md: 'Hello world!\n\nFoo bar.',
        elCount: 2,
        expects: [
            el1 => expect(el1).toBeInstanceOf(HTMLParagraphElement),
            el1 => expect(el1.textContent).toBe('Hello world!'),
            (_, el2) => expect(el2).toBeInstanceOf(HTMLParagraphElement),
            (_, el2) => expect(el2.textContent).toBe('Foo bar.'),
        ],
    },
    {
        description: 'Headings',
        md: '# Heading 1\n\n## Heading 2\n\n### Heading 3',
        elCount: 3,
        expects: [
            h1 => expect(h1).toBeInstanceOf(HTMLHeadingElement),
            h1 => expect(h1.tagName).toBe('H1'),
            h1 => expect(h1.textContent).toBe('Heading 1'),
            (_, h2) => expect(h2).toBeInstanceOf(HTMLHeadingElement),
            (_, h2) => expect(h2.tagName).toBe('H2'),
            (_, h2) => expect(h2.textContent).toBe('Heading 2'),
            (_, __, h3) => expect(h3).toBeInstanceOf(HTMLHeadingElement),
            (_, __, h3) => expect(h3.tagName).toBe('H3'),
            (_, __, h3) => expect(h3.textContent).toBe('Heading 3'),
        ],
    },
    {
        description: 'Unordered List (*)',
        md: '* Number 1\n* Number 2\n* Number 3',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLUListElement),
            el => expect(el.childElementCount).toBe(3),
            el =>
                ['Number 1', 'Number 2', 'Number 3'].forEach((content, idx) =>
                    expect(el.children[idx].textContent).toBe(content)
                ),
            el =>
                Array.from(el.children).forEach(child =>
                    expect(child).toBeInstanceOf(HTMLLIElement)
                ),
        ],
    },
    {
        description: 'Unordered List (-)',
        md: '- Number 1\n- Number 2\n- Number 3',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLUListElement),
            el => expect(el.childElementCount).toBe(3),
            el =>
                ['Number 1', 'Number 2', 'Number 3'].forEach((content, idx) =>
                    expect(el.children[idx].textContent).toBe(content)
                ),
            el =>
                Array.from(el.children).forEach(child =>
                    expect(child).toBeInstanceOf(HTMLLIElement)
                ),
        ],
    },
    {
        description: 'Unordered List (mixed)',
        md: '* Number 1\n- Number 2\n* Number 3',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLUListElement),
            el => expect(el.childElementCount).toBe(3),
            el =>
                ['Number 1', 'Number 2', 'Number 3'].forEach((content, idx) =>
                    expect(el.children[idx].textContent).toBe(content)
                ),
            el =>
                Array.from(el.children).forEach(child =>
                    expect(child).toBeInstanceOf(HTMLLIElement)
                ),
        ],
    },
    {
        description: 'Ordered List (ordered points)',
        md: '1. Number 1\n2. Number 2\n3. Number 3',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLOListElement),
            el => expect(el.childElementCount).toBe(3),
            el =>
                ['Number 1', 'Number 2', 'Number 3'].forEach((content, idx) =>
                    expect(el.children[idx].textContent).toBe(content)
                ),
            el =>
                Array.from(el.children).forEach(child =>
                    expect(child).toBeInstanceOf(HTMLLIElement)
                ),
        ],
    },
    {
        description: 'Ordered List (unordered points)',
        md: '1. Number 1\n42. Number 2\n1. Number 3',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLOListElement),
            el => expect(el.childElementCount).toBe(3),
            el =>
                ['Number 1', 'Number 2', 'Number 3'].forEach((content, idx) =>
                    expect(el.children[idx].textContent).toBe(content)
                ),
            el =>
                Array.from(el.children).forEach(child =>
                    expect(child).toBeInstanceOf(HTMLLIElement)
                ),
        ],
    },
    {
        description: 'Link',
        md: '[Moothel.pet](https://moothel.pet)',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el => expect(el.childElementCount).toBe(1),
            el => expect(el.textContent).toBe('Moothel.pet'),
            el => {
                const anchor = el.querySelector('a')!;
                expect(anchor).toBeInstanceOf(HTMLAnchorElement);
                expect(anchor.textContent).toBe('Moothel.pet');
                expect(anchor.href).toBeOneOf([
                    'https://moothel.pet',
                    'https://moothel.pet/',
                ]); // this is funny because jsdom seems to append the /
            },
        ],
    },
    {
        description: 'Reference Link',
        md: '[Moothel.pet][moothel]\n\n[moothel]: https://moothel.pet',
        elCount: 2, // we get an empty paragraph for the reference link part
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el => expect(el.childElementCount).toBe(1),
            el => expect(el.textContent).toBe('Moothel.pet'),
            el => {
                const anchor = el.querySelector('a')!;
                expect(anchor).toBeInstanceOf(HTMLAnchorElement);
                expect(anchor.textContent).toBe('Moothel.pet');
                expect(anchor.href).toBeOneOf([
                    'https://moothel.pet',
                    'https://moothel.pet/',
                ]); // this is funny because jsdom seems to append the /
            },
            (_, el2) => expect(el2.innerHTML).toBe(''),
        ],
    },
    {
        description: 'Image',
        md: '![Better-Moodle Logo](https://moothel.pet/assets/images/20240805-logo-png.png)',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el => expect(el.childElementCount).toBe(1),
            el => expect(el.textContent).toBe(''),
            el => {
                const img = el.querySelector('img')!;
                expect(img).toBeInstanceOf(HTMLImageElement);
                expect(img.src).toBe(
                    'https://moothel.pet/assets/images/20240805-logo-png.png'
                );
            },
        ],
    },
    {
        description: 'Bold and italic (*)',
        md: 'Hello **bold** world and *italic* foo!',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el =>
                expect(el.textContent).toBe('Hello bold world and italic foo!'),
            el => expect(el.querySelector('strong')?.textContent).toBe('bold'),
            el => expect(el.querySelector('em')?.textContent).toBe('italic'),
        ],
    },
    {
        description: 'Bold and italic (_)',
        md: 'Hello __bold__ world and _italic_ foo!',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLParagraphElement),
            el =>
                expect(el.textContent).toBe('Hello bold world and italic foo!'),
            el => expect(el.querySelector('strong')?.textContent).toBe('bold'),
            el => expect(el.querySelector('em')?.textContent).toBe('italic'),
        ],
    },
    {
        description: 'Preformatted text',
        md: '    I am preformatted\n    Due to the intendation',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLPreElement),
            el =>
                expect(el.textContent).toBe(
                    'I am preformatted\nDue to the intendation'
                ),
        ],
    },
    {
        description: 'Blockquote',
        md: '> I am a Blockquote\n> And I quote things',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLQuoteElement),
            el =>
                expect(el.textContent).toBe(
                    'I am a Blockquote\nAnd I quote things'
                ),
        ],
    },
    {
        description: 'Paragraph starting with HTML',
        md: '<div>I am <b>raw</b> HTML!</div>',
        elCount: 1,
        expects: [
            el => expect(el).toBeInstanceOf(HTMLDivElement),
            el => expect(el.outerHTML).toBe('<div>I am <b>raw</b> HTML!</div>'),
        ],
    },
    {
        description: '<hr> (***)',
        md: '***',
        elCount: 1,
        expects: [el => expect(el).toBeInstanceOf(HTMLHRElement)],
    },
    {
        description: '<hr> (---)',
        md: '---',
        elCount: 1,
        expects: [el => expect(el).toBeInstanceOf(HTMLHRElement)],
    },
];

// simple conversion
testCases.forEach(({ description, md, expects, elCount }) => {
    if (expects.length === 0) return;
    test(description, () => {
        const html = mdToHtml(md);
        const elements = htmlToElements(html);
        expect(elements).toHaveLength(elCount);
        expects.forEach(expectFn => void expectFn(...elements));
    });
});

// testing the `headingStart` parameter

// testing the `idPrefix` parameter

// testing the `pWrap` parameter
