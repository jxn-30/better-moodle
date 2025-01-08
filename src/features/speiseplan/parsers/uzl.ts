import { BETTER_MOODLE_LANG } from 'i18n';
import type { Dish } from '../speiseplan';
import { getDocument } from '@/network';
import type Parser from './index';

const prices = {
    de: ['Studierende', 'Hochschulangehörige', 'Externe'],
    en: ['Students', 'University members', 'Guests'],
};

const todayTreshhold = new Date(Date.now() - 24 * 60 * 60 * 1000);

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
                location: '',
                allergenes: [],
                additives: [],
                types: [],
                prices: [],
                co2: {
                    stars: 1,
                    emission: 0,
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
    getDocument(url).then(doc => {
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

        return {
            dishes,
            prices: prices[BETTER_MOODLE_LANG],
            allergenes: new Map<string, string>(),
            additives: new Map<string, string>(),
            types: new Map<string, { name: string; icon: string }>(),
        };
    });

export default parse;
