import type { Canteen } from './index';

const canteens = new Map<string, Canteen>();

/**
 * Adds a canteen of StudentenwerkSH to the map of canteens
 * @param key - an unique identifier
 * @param name - the readable name of this canteen
 * @param id - the unique id the Studentenwerk uses in their menu URL
 * @returns the result of setting the canteen in the map
 */
const add = (key: string, name = '', id = 0) =>
    canteens.set(key, {
        key,
        title: name,
        url: {
            // yeah, using the luebeck-link with the correct ID works totally fine :)
            de: `https://studentenwerk.sh/de/mensen-in-luebeck?mensa=${id}`,
            en: `https://studentenwerk.sh/en/canteens-in-luebeck?mensa=${id}`,
        },
        urlNextWeek: {
            de: `https://studentenwerk.sh/de/mensen-in-luebeck?mensa=${id}&nw=1`,
            en: `https://studentenwerk.sh/en/canteens-in-luebeck?mensa=${id}&nw=1`,
        },
    });

// make sure, uni specific canteens appear at top
if (__UNI__ === 'uzl') {
    add('uzl');
    add('mhl');
} else if (__UNI__ === 'cau') {
    add('cau1');
    add('cau2');
    add('gaarden');
    add('kesselhaus');
    add('schwentine');
    add('americandiner');
    add('dockside');
}

// now all canteens of StudentenwerkSH will follow
// existing canteens will be overriden but they stay at their place in order
add('uzl', 'Lübeck: Mensa & Cafeteria', 8);
add('mhl', 'Lübeck: Cafeteria Musikhochschule', 9);
add('cau1', 'Kiel: Mensa I & Cafeteria & Café Lounge', 1);
add('cau2', 'Kiel: Mensa II & Cafeteria & Café Lounge', 2);
add('gaarden', 'Kiel: Mensa Gaarden', 3);
add('kesselhaus', 'Kiel: Mensa Kesselhaus (Veggie)', 4);
add('schwentine', 'Kiel: Schwentine Mensa & Cafeteria', 5);
add('americandiner', 'Kiel: American Diner', 6);
add('dockside', 'Kiel: Cafeteria "Dockside"', 16);
add('flensburg', 'Flensburg: Mensa', 7);
add('flensburgb', 'Flensburg: Cafeteria B-Gebäude', 14);
add('heide', 'Heide: Mensa & Cafeteria', 11);
add('wedel', 'Wedel: Cafeteria', 10);
add('osterroenfeld', 'Osterrönfeld: Mensa', 15);

export default canteens;
