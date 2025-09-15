import type { Canteen } from './index';

const canteens = new Map<string, Canteen>();

/**
 * Adds a canteen of StudentenwerkSH to the map of canteens
 * @param key - an unique identifier
 * @param name - the readable name of this canteen
 * @param id - the unique id the Studentenwerk uses in their menu URL
 * @param closingHour - from which hour on to expand the next day
 * @returns the result of setting the canteen in the map
 */
const add = (key: string, name = '', id = 0, closingHour = 24) =>
    canteens.set(key, {
        key,
        title: name,
        closingHour,
        url: {
            'de': `https://studentenwerk.sh/de/essen-uebersicht?mensa=${id}#mensaplan`,
            'en-gb': `https://studentenwerk.sh/en/food-overview?mensa=${id}#mensaplan`,
        },
        urlNextWeek: {
            'de': `https://studentenwerk.sh/de/essen-uebersicht?mensa=${id}&nw=1#mensaplan`,
            'en-gb': `https://studentenwerk.sh/en/food-overview?mensa=${id}&nw=1#mensaplan`,
        },
    });

// make sure, uni specific canteens appear at top
if (__UNI__ === 'uzl') {
    add('uzl');
    add('mhl');
    add('bitsandbytes');
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
add('uzl', 'Lübeck: Mensa & Cafeteria', 8, 15);
add('mhl', 'Lübeck: Cafeteria Musikhochschule', 9, 14);
add('bitsandbytes', 'Lübeck: Bits + Bytes', 17, 15);
add('cau1', 'Kiel: Mensa I & Cafeteria & Café Lounge', 1, 16);
add('cau2', 'Kiel: Mensa II & Cafeteria & Café Lounge', 2, 17);
add('kesselhaus', 'Kiel: Mensa Kesselhaus (Veggie)', 4, 14);
add('schwentine', 'Kiel: Schwentine Mensa & Cafeteria', 5, 15);
add('americandiner', 'Kiel: American Diner', 6, 16);
add('dockside', 'Kiel: Cafeteria "Dockside"', 16, 15);
add('flensburg', 'Flensburg: Mensa', 7, 17);
add('flensburgb', 'Flensburg: Cafeteria B-Gebäude', 14, 15);
add('heide', 'Heide: Mensa & Cafeteria', 11, 14);
add('wedel', 'Wedel: Cafeteria', 10, 16);
add('osterroenfeld', 'Osterrönfeld: Mensa', 15, 13);

export default canteens;
