import { BETTER_MOODLE_LANG } from 'i18n';
import { getDocument } from '@/network';
import type Parser from './index';
import type { Dish, DishType } from '../speiseplan';
import { ONE_DAY, TEN_MINUTES } from '@/times';

const prices = {
    'de': ['Studierende', 'Hochschulangehörige', 'Externe'],
    'en-gb': ['Students', 'University members', 'Guests'],
};

const todayTreshhold = new Date(Date.now() - ONE_DAY);

/**
 * Extracts the dishes from a day table
 * @param dayEl - the div element that contains the dishes of this day
 * @returns the dishes of this day
 */
const getDishes = (dayEl: HTMLDivElement) => {
    const dishes = new Set<Dish>();

    dayEl
        .querySelectorAll<HTMLDivElement>('.mensa_menu_detail')
        .forEach(dishEl => {
            const name: Dish['name'] = [{ text: '' }];

            dishEl.querySelector('.menu_name')?.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    name.push({ text: node.textContent?.trim() ?? '' });
                } else if (node instanceof HTMLBRElement) {
                    name.push({ text: node });
                } else if (
                    node instanceof HTMLElement &&
                    node.classList.contains('mensa_zusatz')
                ) {
                    name.at(-1)!.info = node.textContent?.trim() ?? '';
                }
            });

            const dish = {
                name,
                location:
                    dishEl.querySelector('[class*="mensatyp_"]')?.textContent ??
                    '',
                allergenes:
                    dishEl.dataset.allergene?.split('|').filter(Boolean) ?? [],
                additives:
                    dishEl.dataset.zusatzstoffe?.split('|').filter(Boolean) ??
                    [],
                types: dishEl.dataset.arten?.split('|').filter(Boolean) ?? [],
                prices: Array.from(
                    dishEl.querySelectorAll<HTMLSpanElement>('.menu_preis span')
                ).map(p =>
                    parseFloat(p.textContent?.replace(/,/g, '.') ?? '-1')
                ),
                co2: {
                    stars: Number(
                        dishEl.querySelector<HTMLDivElement>('.co2star')
                            ?.dataset.anz ?? '0'
                    ),
                    emission: Number(
                        dishEl
                            .querySelector('.co2box_text')
                            ?.textContent?.match(/\d+(?=\s+Gramm?)/)?.[0] ?? '0'
                    ),
                },
            };

            dishes.add(dish);
        });

    return dishes;
};

/**
 * Parses a StudentenwerkSH canteen menu
 * @param url - the url parse from
 * @returns the speiseplan as a promise
 */
const parse: Parser = (url: string) =>
    getDocument(url, TEN_MINUTES).then(({ lastUpdate, value: doc }) => {
        const dishes = new Map<Date, Set<Dish>>();

        doc.querySelectorAll<HTMLDivElement>(
            '.mensatag .tag_headline[data-day]'
        ).forEach(dayEl => {
            const day = new Date(dayEl.dataset.day ?? '');
            // invalid date or day is in the past
            if (isNaN(day.getTime()) || day < todayTreshhold) return;
            const dayDishes = getDishes(dayEl);
            if (dayDishes.size > 0) {
                dishes.set(day, dayDishes);
            }
        });

        const allergenes = new Map(
            Array.from(
                doc.querySelectorAll<HTMLDivElement>(
                    '.filterbutton[data-typ="1"]'
                )
            ).map(el => [
                el.dataset.wert ?? '',
                el.querySelector('span:not(.abk)')?.textContent?.trim() ?? '',
            ])
        );

        const additives = new Map(
            Array.from(
                doc.querySelectorAll<HTMLDivElement>(
                    '.filterbutton[data-typ="2"]'
                )
            ).map(el => [
                el.dataset.wert ?? '',
                el.querySelector('span:not(.abk)')?.textContent?.trim() ?? '',
            ])
        );

        const types = new Map(
            Array.from(
                doc.querySelectorAll<HTMLDivElement>(
                    '.filterbutton[data-typ="3"]'
                )
            ).map(el => {
                // .src returns with Moodle instance as hostname so we need to do some URL tricks here
                const icon = el.querySelector<HTMLImageElement>('img')?.src;
                const iconPath = icon ? new URL(icon).pathname : undefined;
                const dishType = {
                    name: el.textContent?.trim() ?? '',
                    icon: iconPath ? new URL(iconPath, url) : undefined,
                } as DishType;
                if (el.dataset.ex === '1' && icon) {
                    dishType.name =
                        doc.querySelector<HTMLImageElement>(
                            `:not(.filterbutton) > img[src*="${iconPath}"]`
                        )?.title ?? dishType.name;
                    dishType.isExclusive = true;
                }
                return [el.dataset.wert ?? '', dishType];
            })
        );

        // SH-Teller Icon is not in the filters on english StudentenwerkSH page, so we need to define it here manually
        types.set('SHT', {
            name: 'Schleswig-Holstein Teller',
            icon: new URL(
                'https://studentenwerk.sh/upload/img/sh_teller1.png?h=80&t=2'
            ),
        });

        return {
            timestamp: lastUpdate,
            dishes,
            prices: prices[BETTER_MOODLE_LANG],
            allergenes,
            additives,
            types,
        };
    });

export default parse;
