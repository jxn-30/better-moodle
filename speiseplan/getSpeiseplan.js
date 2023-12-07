import fs from 'fs/promises';
import { JSDOM } from 'jsdom';

const filterTypes = {
    1: 'allergene',
    2: 'zusatzstoffe',
    3: 'arten',
};
Object.seal(filterTypes);
Object.freeze(filterTypes);

const getSpeisen = (document, Node) => {
    const speisen = {};
    document.querySelectorAll('.mensa_menu_detail').forEach(speise => {
        const day = speise.closest('[data-day]').dataset.day;
        speisen[day] ??= [];
        const items = [{ name: '' }];
        speise.querySelector('.menu_name').childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                items.at(-1).name += ` ${node.textContent.trim()}`;
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
                .map(p => parseFloat(p)),
        });
    });
    return speisen;
};

fetch('https://studentenwerk.sh/de/mensen-in-luebeck?ort=3&mensa=8')
    .then(res => res.text())
    .then(html => new JSDOM(html))
    .then(({ window: { document, Node, URL } }) => {
        const filters = {};
        document.querySelectorAll('.filterbutton').forEach(filter => {
            const type = filterTypes[filter.dataset.typ];
            filters[type] ??= {};
            const img = filter.querySelector('img')?.src ?? '';
            filters[type][filter.dataset.wert] = {
                title:
                    filter
                        .querySelector('span:not(.abk)')
                        ?.textContent?.trim() ?? '',
                abk:
                    filter.querySelector('span.abk')?.textContent?.trim() ?? '',
                img: img && new URL(img, 'https://studentenwerk.sh/').href,
            };
        });
        Object.freeze(filters);
        return { filters, speisen: getSpeisen(document, Node) };
    })
    .then(speiseplan =>
        fetch(
            'https://studentenwerk.sh/de/mensen-in-luebeck?ort=3&mensa=8&nw=1'
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
    )
    .then(speiseplan =>
        fs.writeFile('speiseplan.json', JSON.stringify(speiseplan, null, 4), {
            encoding: 'utf-8',
        })
    );
