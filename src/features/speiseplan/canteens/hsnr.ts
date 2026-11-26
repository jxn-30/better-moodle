import type { Canteen } from './index';

const canteens = new Map<string, Canteen>();

/**
 * Helper to generate Ventopay / mocca.digitalsignage URL from canteen ID
 * @param id - Ventopay location ID
 * @returns The formatted URL for the canteen menu
 */
const getVentopayUrl = (id: number) =>
    `https://mocca.stw-d.de/mocca.digitalsignage/${id}/Speiseplan${id}/Index.html`;

/**
 * Adds a canteen of Studierendenwerk Düsseldorf / HSNR to the map
 * @param key - Unique identifier for Better-Moodle settings
 * @param name - Human-readable display name in the dropdown
 * @param id - Ventopay location ID
 * @param closingHour - Hour after which the UI defaults to tomorrow's menu
 * @returns The updated canteens map instance
 */
const add = (key: string, name = '', id = 0, closingHour = 24) => {
    const ventopayUrl = getVentopayUrl(id);

    return canteens.set(key, {
        key,
        title: name,
        closingHour,
        hasCO2: false, // Stw-d/Ventopay does not provide CO2 scores
        url: { 'de': ventopayUrl, 'en-gb': ventopayUrl },
        // urlNextWeek is deleted so nly one week is shown
    });
};

// Pre-insert HSNR canteens so they appear first in Map iteration order
// for HSNR users only. Map.set() on an existing key updates its value
// but does NOT change its position, so the later unconditional add()
// calls below just overwrite these placeholders in place.
if (__UNI__ === 'hsnr') {
    add('hsnr_mg');
    add('hsnr_kr_sued');
    add('hsnr_kr_west');
}

// all canteens of Studentenwerk Düsseldorf
add(
    'hhu_hauptmensa',
    'Düsseldorf: Mensa Universitätsstraße (Universitätsmensa)',
    3500,
    14
);
add('hhu_campusvita', 'Düsseldorf: Restaurant & Bar Campus Vita', 3580, 15);
add(
    'hhu_essenausgabesued',
    'Düsseldorf: Essensausgabe Süd (Math.-Nat Fakultät)',
    3508,
    14
);
add('mensaderendorf', 'Düsseldorf: Mensa Campus Derendorf', 3530, 15);
add('musikhochschule', 'Düsseldorf: Musikhochschule', 3590, 14);
add('kunstakademie', 'Düsseldorf: Mensa Kunstakademie', 3510, 15);
add('hsnr_kr_sued', 'Krefeld: Mensa Obergath (Süd)', 3540, 15);
add('hsnr_kr_west', 'Krefeld: Mensa Frankenring (West)', 3550, 15);
add('hsnr_mg', 'Mönchengladbach: Mensa Rheydter Straße', 3570, 15);
add('mensalkleve', 'Kleve: Mensa Sommerdeich', 3560, 15);
add('kamplintfort', 'Kamp-Lintfort: Mensa Fr.-Heinrich-Allee', 3520, 15);

export default canteens;
