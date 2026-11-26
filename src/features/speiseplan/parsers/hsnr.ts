import { getDocument } from '#lib/network';
import { getToday } from '#lib/temporal';
import type Parser from './index';
import { TEN_MINUTES } from '#lib/times';
import type { Dish, DishType } from '../speiseplan';

const prices = {
    'de': ['Studierende', 'Nicht Studierende'],
    'en-gb': ['Students', 'Non-Students'],
};

/**
 * Key definitions for Additives (Zusatzstoffe)
 */
export enum AdditiveKey {
    Preservatives = '1',
    Antioxidants = '2',
    Colourings = '3',
    FlavourEnhancers = '4',
    Sulphited = '5',
    Phosphates = '6',
    Blackened = '7',
    Waxed = '8',
    Sweeteners = '9',
    PhenylalanineSource = '10',
    SugarAndSweeteners = '11',
    LaxativeEffect = '12',
    Caffeine = '16',
    Quinine = '17',
}

/**
 * Key definitions for Allergens (Allergene) & Diet Tags
 */
export enum AllergenKey {
    SulphurDioxide = '18',
    MilkLactose = '19',
    Gluten = '20',
    Wheat = '20a',
    Rye = '20b',
    Barley = '20c',
    Oats = '20d',
    Spelt = '20e',
    Kamut = '20f',
    HybridStrains = '20g',
    Soybeans = '21',
    Celery = '22',
    Mustard = '23',
    Sesame = '24',
    Lupins = '25',
    Peanuts = '26',
    Fish = '27',
    Crustaceans = '28',
    Molluscs = '29',
    Nuts = '30',
    Almonds = '30a',
    Hazelnuts = '30b',
    Walnuts = '30c',
    CashewNuts = '30d',
    Pecans = '30e',
    BrazilNuts = '30f',
    Pistachios = '30g',
    Macadamia = '30h',
    Eggs = '31',
    Poultry = 'G',
    Beef = 'R',
    Pork = 'S',
    Alcohol = 'A',
    Vegetarian = 'F',
    Vegan = 'V',
    CheckProduct = 'Z',
}

/**
 * Fixes broken image filenames in Ventopay's digital signage feeds
 * based on folder context.
 */
const allergenFilenameFixes: Record<string, string> = {
    '5': AllergenKey.Eggs, // 5.png in allergens displays "31"
    '6': AllergenKey.Fish, // 6.png in allergens displays "Fish" (27)
    '7': AllergenKey.Barley, // 7.png in allergens displays "20c"
    '8': AllergenKey.Gluten, // 8.png in allergens displays "20"
    '9': AllergenKey.Oats, // 9.png in allergens displays "20d"
    '10': AllergenKey.Hazelnuts, // 10.png in allergens displays "30b"
    '11': AllergenKey.Almonds, //11.png in allergens displays "30a"
    '12': AllergenKey.MilkLactose, // 12.png in allergens displays "19"
    '13': AllergenKey.Rye, // 13.png in allergens displays "20b"
    '14': AllergenKey.Nuts, // 14.png in allergens displays "30"
    '15': AllergenKey.SulphurDioxide, //15.png in allergense displays "18"
    '16': AllergenKey.Celery, // 16.png in allergens displays "22"
    '17': AllergenKey.Mustard, // 17.png in allergens displays "23"
    '18': AllergenKey.Sesame, // 18.png in allergens displays "24"
    '19': AllergenKey.Soybeans, // 19.png in allergens displays "21"
    '20': AllergenKey.Wheat, // 20.png in allergens displays "20a"
    '27': AllergenKey.Peanuts, // 27.png in allergens displays "26" and for some reason the image it not black like all others. Why, no idear but works too
};

const additiveFilenameFixes: Record<string, string> = {
    '4': AllergenKey.Pork, // 4.png in additives displays "Pork"
    '5': AdditiveKey.Antioxidants, // 5.png in additives displays "2"
    '7': AdditiveKey.Blackened, // this maps corect, WHAT?!
    '8': AdditiveKey.Colourings, // 8.png in additives displays "3"
    '11': AdditiveKey.Preservatives, // 11.png in additives displays "1"
    '13': AllergenKey.Poultry, // 13.png in additives displays "Poultry"
    '14': AllergenKey.Beef, // 14.png in additives displays "Beef"
    '17': AdditiveKey.Phosphates, // 17.png in additives displays "6"
    '18': AdditiveKey.Sweeteners, // 18.png in additives displays "24"
    '21': AdditiveKey.SugarAndSweeteners, // 21.png in additives displays "11"
    '28': AdditiveKey.Sulphited, // 28.png in additives displays "5"
};

/**
 * Localized descriptions mapped by Enum keys
 */
const legend: Record<string, Record<AdditiveKey | AllergenKey, string>> = {
    'de': {
        // Zusatzstoffe
        [AdditiveKey.Preservatives]: 'mit Konservierungsstoff',
        [AdditiveKey.Antioxidants]: 'mit Antioxidationsmittel',
        [AdditiveKey.Colourings]: 'mit Farbstoff',
        [AdditiveKey.FlavourEnhancers]: 'mit Geschmacksverstärker',
        [AdditiveKey.Sulphited]: 'geschwefelt',
        [AdditiveKey.Phosphates]: 'mit Phosphat',
        [AdditiveKey.Blackened]: 'geschwärzt',
        [AdditiveKey.Waxed]: 'gewachst',
        [AdditiveKey.Sweeteners]: 'mit Süßungsmittel',
        [AdditiveKey.PhenylalanineSource]: 'enthält eine Phenylalaninquelle',
        [AdditiveKey.SugarAndSweeteners]: 'mit Zuckerart und Süßungsmittel',
        [AdditiveKey.LaxativeEffect]:
            'kann bei übermäßigem Verzehr abführend wirken',
        [AdditiveKey.Caffeine]: 'koffeinhaltig',
        [AdditiveKey.Quinine]: 'chininhaltig',

        // Allergene
        [AllergenKey.SulphurDioxide]:
            'Schwefeldioxid und Sulfite (mehr als 10 mg/kg oder l)',
        [AllergenKey.MilkLactose]:
            'Milch und Milcherzeugnisse (einschließlich Laktose)',
        [AllergenKey.Gluten]:
            'Glutenhaltiges Getreide und daraus hergestellte Erzeugnisse',
        [AllergenKey.Wheat]: 'Weizen',
        [AllergenKey.Rye]: 'Roggen',
        [AllergenKey.Barley]: 'Gerste',
        [AllergenKey.Oats]: 'Hafer',
        [AllergenKey.Spelt]: 'Dinkel',
        [AllergenKey.Kamut]: 'Kamut',
        [AllergenKey.HybridStrains]: 'Hybridstämme',
        [AllergenKey.Soybeans]: 'Sojabohnen und Sojabohnenerzeugnisse',
        [AllergenKey.Celery]: 'Sellerie und Sellerieerzeugnisse',
        [AllergenKey.Mustard]: 'Senf und Senferzeugnisse',
        [AllergenKey.Sesame]: 'Sesamsamen und Sesamsamenerzeugnisse',
        [AllergenKey.Lupins]: 'Lupinen und Lupinenerzeugnisse',
        [AllergenKey.Peanuts]: 'Erdnüsse und Erdnusserzeugnisse',
        [AllergenKey.Fish]: 'Fisch und Fischerzeugnisse',
        [AllergenKey.Crustaceans]: 'Krebstiere und Krebstiererzeugnisse',
        [AllergenKey.Molluscs]: 'Weichtiere und Weichtiererzeugnisse',
        [AllergenKey.Nuts]: 'Schalenfrüchte und Schalenfruchterzeugnisse',
        [AllergenKey.Almonds]: 'Mandeln',
        [AllergenKey.Hazelnuts]: 'Haselnüsse',
        [AllergenKey.Walnuts]: 'Walnüsse',
        [AllergenKey.CashewNuts]: 'Cashewkerne',
        [AllergenKey.Pecans]: 'Pecannüsse',
        [AllergenKey.BrazilNuts]: 'Paranüsse',
        [AllergenKey.Pistachios]: 'Pistazien',
        [AllergenKey.Macadamia]: 'Macadamia',
        [AllergenKey.Eggs]: 'Eier und Eierzeugnisse',

        // Diet tags
        [AllergenKey.Poultry]: 'mit Geflügel',
        [AllergenKey.Beef]: 'mit Rindfleisch',
        [AllergenKey.Pork]: 'mit Schweinefleisch',
        [AllergenKey.Alcohol]: 'mit Alkohol',
        [AllergenKey.Vegetarian]: 'vegetarisch',
        [AllergenKey.Vegan]: 'vegan',
        [AllergenKey.CheckProduct]:
            'Bitte beachten Sie die Auszeichnung am Produkt',
    },
    'en-gb': {
        // Additives
        [AdditiveKey.Preservatives]: 'with preservatives',
        [AdditiveKey.Antioxidants]: 'with antioxidants',
        [AdditiveKey.Colourings]: 'with colourings',
        [AdditiveKey.FlavourEnhancers]: 'contains flavour enhancers',
        [AdditiveKey.Sulphited]: 'sulphited',
        [AdditiveKey.Phosphates]: 'contains phosphates',
        [AdditiveKey.Blackened]: 'blackened',
        [AdditiveKey.Waxed]: 'waxed',
        [AdditiveKey.Sweeteners]: 'contains sweeteners',
        [AdditiveKey.PhenylalanineSource]: 'contains a source of phenylalanine',
        [AdditiveKey.SugarAndSweeteners]: 'contains sugar and sweeteners',
        [AdditiveKey.LaxativeEffect]:
            'may have a laxative effect if consumed in excess',
        [AdditiveKey.Caffeine]: 'contains caffeine',
        [AdditiveKey.Quinine]: 'contains quinine',

        // Allergens
        [AllergenKey.SulphurDioxide]:
            'Sulphur dioxide and sulphites (more than 10 mg/kg or l)',
        [AllergenKey.MilkLactose]: 'Milk and milk products (including lactose)',
        [AllergenKey.Gluten]:
            'Cereals containing gluten and products derived therefrom',
        [AllergenKey.Wheat]: 'Wheat',
        [AllergenKey.Rye]: 'Rye',
        [AllergenKey.Barley]: 'Barley',
        [AllergenKey.Oats]: 'Oats',
        [AllergenKey.Spelt]: 'Spelt',
        [AllergenKey.Kamut]: 'Kamut',
        [AllergenKey.HybridStrains]: 'Hybrid strains',
        [AllergenKey.Soybeans]: 'Soya beans and soya bean products',
        [AllergenKey.Celery]: 'Celery and celery products',
        [AllergenKey.Mustard]: 'Mustard and mustard products',
        [AllergenKey.Sesame]: 'Sesame seeds and sesame seed products',
        [AllergenKey.Lupins]: 'Lupins and lupin products',
        [AllergenKey.Peanuts]: 'Peanuts and peanut products',
        [AllergenKey.Fish]: 'Fish and fish products',
        [AllergenKey.Crustaceans]: 'Crustaceans and crustacean products',
        [AllergenKey.Molluscs]: 'Molluscs and mollusc products',
        [AllergenKey.Nuts]: 'Nuts and nut products',
        [AllergenKey.Almonds]: 'Almonds',
        [AllergenKey.Hazelnuts]: 'Hazelnuts',
        [AllergenKey.Walnuts]: 'Walnuts',
        [AllergenKey.CashewNuts]: 'Cashew nuts',
        [AllergenKey.Pecans]: 'Pecans',
        [AllergenKey.BrazilNuts]: 'Brazil nuts',
        [AllergenKey.Pistachios]: 'Pistachios',
        [AllergenKey.Macadamia]: 'Macadamia',
        [AllergenKey.Eggs]: 'Eggs and egg products',

        // Diet tags
        [AllergenKey.Poultry]: 'contains poultry',
        [AllergenKey.Beef]: 'contains beef',
        [AllergenKey.Pork]: 'contains pork',
        [AllergenKey.Alcohol]: 'contains alcohol',
        [AllergenKey.Vegetarian]: 'vegetarian',
        [AllergenKey.Vegan]: 'vegan',
        [AllergenKey.CheckProduct]: 'Please check the labelling on the product',
    },
};

export const DIET_KEYS = new Set<string>([
    AllergenKey.Vegan, // 'V'
    AllergenKey.Vegetarian, // 'F'
    AllergenKey.Pork, // 'S'
    AllergenKey.Beef, // 'R'
    AllergenKey.Poultry, // 'G'
    AllergenKey.Alcohol, // 'A'
    AllergenKey.Fish, // '27'
]);

/**
 * Dynamically builds the DishType map with absolute icon URLs.
 * @param baseUrl - Base URL of the canteen sub-feed.
 * @param lang - Currently active language identifier.
 * @param discoveredIcons - Map of diet keys to URLs extracted directly from HTML img tags.
 * @returns Map of diet keys to their localized name and icon URL.
 */
function getTypesMap(
    baseUrl: string,
    lang: 'de' | 'en-gb',
    discoveredIcons?: Map<string, URL>
): Map<string, DishType> {
    const types = new Map<string, DishType>();
    const currentLegend = legend[lang];

    const iconPaths: Record<string, string> = {
        [AllergenKey.Vegan]: 'images/allergens/V.png',
        [AllergenKey.Vegetarian]: 'images/allergens/F.png',
        [AllergenKey.Pork]: 'images/additives/4.png',
        [AllergenKey.Beef]: 'images/allergens/R.png',
        [AllergenKey.Poultry]: 'images/additives/13.png',
        [AllergenKey.Alcohol]: 'images/allergens/A.png',
        [AllergenKey.Fish]: 'images/allergens/6.png',
    };

    const folderBaseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);

    DIET_KEYS.forEach(key => {
        const name = currentLegend[key as AllergenKey];
        if (name) {
            const icon =
                discoveredIcons?.get(key) ??
                new URL(iconPaths[key], folderBaseUrl);
            types.set(key, { name, icon });
        }
    });

    return types;
}

/**
 * Parses a German-formatted date string (DD.MM.YYYY) into a Date object.
 * @param dateStr - The date string to parse, e.g. "06.08.2026".
 * @returns The parsed Date, or null if the string doesn't match the expected format.
 */
function parseGermanDate(dateStr: string): Temporal.PlainDate | null {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dateStr.trim());
    if (!match) return null;

    const [, day, month, year] = match;
    try {
        return Temporal.PlainDate.from({
            year: Number(year),
            month: Number(month),
            day: Number(day),
        });
    } catch {
        return null;
    }
}

/**
 * Extracts a numeric price from a raw text cell, normalizing German
 * comma-decimal notation to a parseable float.
 * @param text - The raw cell text to extract a price from, or null/undefined.
 * @returns The extracted price, or -1 if no valid price could be found.
 */
function extractPrice(text: string | null | undefined): number {
    if (!text) return -1;
    const cleaned = /\d+(?:\.\d+)?/.exec(text.replace(',', '.'));
    return cleaned ? parseFloat(cleaned[0]) : -1;
}

/**
 * Scrapes all dishes for a single day feed document, counting each menu item as a separate counter.
 * @param doc - The parsed HTML document for the day feed.
 * @param docUrl - The absolute URL the document was fetched from.
 * @param discoveredTypeIcons - Map of diet keys to icon URLs.
 * @param lang - Currently active language identifier for counter labels.
 * @returns The set of dishes found for this day.
 */
function getDishesForDay(
    doc: Document,
    docUrl: string,
    discoveredTypeIcons: Map<string, URL>,
    lang: 'de' | 'en-gb'
): Set<Dish> {
    const dishes = new Set<Dish>();

    doc.querySelectorAll<HTMLDivElement>('.menuitem').forEach(
        (menuEl, index) => {
            if (menuEl.querySelector('.infocontainer')) return;

            const counterIndex = index + 1;
            const location =
                lang === 'en-gb' ?
                    `Counter ${counterIndex}`
                :   `Theke ${counterIndex}`;

            const dishTitle =
                menuEl.querySelector('.container div')?.textContent?.trim() ??
                '';

            if (!dishTitle) return;

            let totalStudentPrice = 0;
            let totalGuestPrice = 0;
            let hasPrice = false;

            menuEl
                .querySelectorAll('.article-component-header td')
                .forEach(cell => {
                    const text = cell.textContent ?? '';

                    if (
                        text.includes('Studierende') &&
                        !text.includes('Nicht')
                    ) {
                        const price = extractPrice(text);
                        if (price > 0) {
                            totalStudentPrice += price;
                            hasPrice = true;
                        }
                    } else if (text.includes('Nicht Studierende')) {
                        const price = extractPrice(text);
                        if (price > 0) {
                            totalGuestPrice += price;
                            hasPrice = true;
                        }
                    }
                });

            const allergenes: string[] = [];
            const additives: string[] = [];
            const types: string[] = [];

            menuEl
                .querySelectorAll<HTMLImageElement>('img.allergenimage')
                .forEach(img => {
                    const rawSrc = (img.getAttribute('src') ?? img.src).replace(
                        /\\/g,
                        '/'
                    );
                    const match =
                        /(\w+)\/(\d+|[a-zA-Z])\.(?:png|jpg|svg)/i.exec(rawSrc);

                    if (match) {
                        const [, folder, rawId] = match;
                        const isAdditiveFolder =
                            folder.toLowerCase() === 'additives';

                        let id: string;
                        if (isAdditiveFolder) {
                            id = additiveFilenameFixes[rawId] ?? rawId;
                        } else {
                            id = allergenFilenameFixes[rawId] ?? rawId;
                        }

                        if (DIET_KEYS.has(id)) {
                            if (!types.includes(id)) {
                                types.push(id);
                            }
                            if (!discoveredTypeIcons.has(id)) {
                                try {
                                    const absUrl = new URL(rawSrc, docUrl);
                                    discoveredTypeIcons.set(id, absUrl);
                                } catch {
                                    // ignore invalid URL errors
                                }
                            }
                        } else if (isAdditiveFolder) {
                            if (!additives.includes(id)) {
                                additives.push(id);
                            }
                        } else {
                            if (!allergenes.includes(id)) {
                                allergenes.push(id);
                            }
                        }
                    }
                });

            dishes.add({
                name: [{ text: dishTitle }],
                location,
                prices:
                    hasPrice ?
                        [
                            Number(totalStudentPrice.toFixed(2)),
                            Number(totalGuestPrice.toFixed(2)),
                        ]
                    :   [-1, -1],
                allergenes,
                additives,
                types,
                co2: false,
            });
        }
    );

    return dishes;
}

/**
 * Fetches and parses the HSNR/Studentenwerk Düsseldorf canteen menu feed.
 * @param url - The canteen's index URL, containing iframe links to each day's menu.
 * @param lang - The language to render labels in.
 * @returns A promise resolving to the parsed speiseplan data.
 */
const parse: Parser = (url: string, lang: 'de' | 'en-gb') =>
    getDocument(url, TEN_MINUTES).then(async ({ lastUpdate, value: doc }) => {
        const today = getToday();
        const dishes = new Map<Temporal.PlainDate, Set<Dish>>();

        const currentLegend = legend[lang];
        const allergenes = new Map<string, string>();
        const additives = new Map<string, string>();

        const additiveKeyValues = new Set<string>(Object.values(AdditiveKey));
        const allergenKeyValues = new Set<string>(Object.values(AllergenKey));

        Object.entries(currentLegend).forEach(([key, label]) => {
            if (DIET_KEYS.has(key)) return;
            if (additiveKeyValues.has(key)) {
                additives.set(key, label);
            } else if (allergenKeyValues.has(key)) {
                allergenes.set(key, label);
            }
        });

        const rawSources = Array.from(
            doc.querySelectorAll<HTMLIFrameElement>(
                '#iframeContainer iframe[src]'
            )
        )
            .map(iframe => iframe.getAttribute('src'))
            .filter((src): src is string => Boolean(src));

        const iframeSources = Array.from(new Set(rawSources));

        const iframeAbsoluteUrl =
            iframeSources[0] ? new URL(iframeSources[0], url).href : url;

        const discoveredTypeIcons = new Map<string, URL>();
        const seenDateStrings = new Set<string>();

        // Each iframe represents a separate day feed
        for (const src of iframeSources) {
            const dayUrl = new URL(src, url).href;
            const { value: dayDoc } = await getDocument(dayUrl, TEN_MINUTES);

            const dateStr =
                dayDoc.querySelector('.headerblock p')?.textContent?.trim() ??
                '';

            if (!dateStr || seenDateStrings.has(dateStr)) {
                continue;
            }

            const dayDate = parseGermanDate(dateStr);
            if (!dayDate || Temporal.PlainDate.compare(dayDate, today) < 0) {
                continue;
            }

            // Get dishes for this day, with counters numbered starting from 1 for each day's menuitems
            const dayDishes = getDishesForDay(
                dayDoc,
                dayUrl,
                discoveredTypeIcons,
                lang
            );

            if (dayDishes.size > 0) {
                seenDateStrings.add(dateStr);
                dishes.set(dayDate, dayDishes);
            }
        }

        const types = getTypesMap(iframeAbsoluteUrl, lang, discoveredTypeIcons);

        return {
            timestamp: lastUpdate,
            dishes,
            prices: prices[lang] ?? prices.de,
            allergenes,
            additives,
            types,
        };
    });

export default parse;
