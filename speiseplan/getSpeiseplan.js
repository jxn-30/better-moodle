import assert from 'node:assert';
import fs from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const filterTypes = {
    1: 'allergene',
    2: 'zusatzstoffe',
    3: 'arten',
};
Object.seal(filterTypes);
Object.freeze(filterTypes);

/**
 * @typedef {Object} Filter
 * @property {string} title
 * @property {string} abk
 * @property {string} [img]
 */

/**
 * @typedef {Object} Speise
 * @property {boolean} mensa
 * @property {{name: string, zusatz?: string}[]} items
 * @property {string[]} allergene
 * @property {string[]} zusatzstoffe
 * @property {string[]} arten
 * @property {number[]} preise
 */

/**
 * @typedef {Object} Speiseplan
 * @property {Record<string, Speise[]>} speisen
 */

/**
 * @typedef {Object} SpeiseplanJSON
 * @property {number} lastUpdate
 * @property {Speiseplan} de
 * @property {Speiseplan} en
 */

/**
 * @param {HTMLDocument} document
 * @param {Node} Node
 * @returns {Speiseplan.speisen}
 */
const getSpeisen = (document, Node) => {
    const speisen = {};
    document.querySelectorAll('.mensa_menu_detail').forEach(speise => {
        const day = speise.closest('[data-day]').dataset.day;
        speisen[day] ??= [];
        const items = [{ name: '' }];
        speise.querySelector('.menu_name').childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                items.at(-1).name += node.textContent.trim();
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR') {
                    items.push({ name: '' });
                } else if (node.classList.contains('mensa_zusatz')) {
                    items.at(-1).zusatz = node.textContent.trim();
                }
            }
        });
        speisen[day].push({
            mensa: !!speise.querySelector('.mensatyp_mensa'),
            items,
            allergene: speise.dataset.allergene.split('|').filter(Boolean),
            zusatzstoffe: speise.dataset.zusatzstoffe
                .split('|')
                .filter(Boolean),
            arten: speise.dataset.arten.split('|').filter(Boolean),
            preise: speise
                .querySelector('.menu_preis')
                ?.textContent?.trim()
                .split('/')
                .map(p => p.trim().replace(',', '.'))
                .map(p => parseFloat(p))
                .filter(Boolean),
        });
    });
    Object.values(speisen).forEach(day =>
        day.sort(
            (a, b) =>
                b.mensa - a.mensa || // mensa first
                JSON.stringify(a.items).localeCompare(JSON.stringify(b.items)) // then sort by items
        )
    );
    return speisen;
};

const localizedPath = {
    de: 'mensen-in-luebeck',
    en: 'food-overview',
};
Object.seal(localizedPath);
Object.freeze(localizedPath);

/**
 * @param {string} lang
 * @returns {Promise<{speisen: {}, filters: {}}>}
 */
const getLocalizedSpeiseplan = lang =>
    fetch(
        `https://studentenwerk.sh/${lang}/${localizedPath[lang]}?ort=3&mensa=8`
    )
        .then(res => res.text())
        .then(html => new JSDOM(html))
        .then(({ window: { document, Node, URL } }) => {
            const filters = {};
            document.querySelectorAll('.filterbutton').forEach(filter => {
                const type = filterTypes[filter.dataset.typ];
                filters[type] ??= {};
                const img = filter.querySelector('img')?.src ?? undefined;
                filters[type][filter.dataset.wert] = {
                    title:
                        filter
                            .querySelector('span:not(.abk)')
                            ?.textContent?.trim() ?? '',
                    abk:
                        filter.querySelector('span.abk')?.textContent?.trim() ??
                        '',
                    ...(img
                        ? { img: new URL(img, 'https://studentenwerk.sh').href }
                        : {}),
                };
            });
            Object.freeze(filters);
            return { filters, speisen: getSpeisen(document, Node) };
        })
        .then(speiseplan =>
            fetch(
                `https://studentenwerk.sh/${lang}/${localizedPath[lang]}?ort=3&mensa=8&nw=1`
            )
                .then(res => res.text())
                .then(html => new JSDOM(html))
                .then(({ window: { document, Node } }) => {
                    speiseplan.speisen = {
                        ...speiseplan.speisen,
                        ...getSpeisen(document, Node),
                    };
                    return speiseplan;
                })
        );
Promise.all([
    getLocalizedSpeiseplan('de'),
    getLocalizedSpeiseplan('en'),
    fs.readFile('speiseplan.json', { encoding: 'utf-8' }),
])
    .then(([de, en, oldSpeiseplan]) => ({
        de,
        en,
        oldSpeiseplan: JSON.parse(oldSpeiseplan),
    }))
    .then(({ de, en, oldSpeiseplan }) =>
        assert.deepStrictEqual(
            { de: oldSpeiseplan.de, en: oldSpeiseplan.en },
            { de, en },
            new Error(
                JSON.stringify({ lastUpdate: Date.now(), de, en }, null, 4)
            )
        )
    )
    .catch(({ message }) =>
        fs.writeFile('speiseplan.json', message, {
            encoding: 'utf-8',
        })
    );
