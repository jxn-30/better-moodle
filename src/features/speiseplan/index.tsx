import { BooleanSetting } from '@/Settings/BooleanSetting';
import type Canteens from './canteens';
import classNames from 'classnames';
import { dateToString } from '@/localeString';
import FeatureGroup from '@/FeatureGroup';
import { FieldSet } from '@/Components';
import { Modal } from '@/Modal';
import Parser from './parsers';
import { PREFIX } from '@/helpers';
import { ready } from '@/DOM';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './style.module.scss';
import { BETTER_MOODLE_LANG, languages, LL } from 'i18n';

const enabled = new BooleanSetting('enabled', true);
const language = new SelectSetting('language', 'auto', [
    'auto',
    ...Array.from(languages.entries()).map(([locale, { name, flag }]) => ({
        key: locale,
        title: `${flag} ${name}`,
    })),
]);

const canteens = Object.values(
    import.meta.glob(import.meta.env.VITE_SPEISEPLAN_CANTEEN_GLOB, {
        import: 'default',
        eager: true,
    })
)[0] as Canteens;

const canteen = new SelectSetting(
    'canteen',
    Array.from(canteens.keys())[0],
    Array.from(canteens.values())
);

const parse = Object.values(
    import.meta.glob(import.meta.env.VITE_SPEISEPLAN_PARSER_GLOB, {
        import: 'default',
        eager: true,
    })
)[0] as Parser;

const speiseplanLink = `#${PREFIX('speiseplan')}`;

// this is shorter because prettier would put each array element into a single line
const emojis =
    '🍔,🍟,🍕,🌭,🥪,🌮,🌯,🫔,🥙,🧆,🥚,🍳,🥘,🍲,🥣,🥗,🍝,🍱,🍘,🍙,🍚,🍛,🍜,🍢,🍣,🍤,🍥,🥮,🥟,🥠,🥡'.split(
        ','
    );

/**
 * Gets a random food emoji from predefined list.
 * @returns a random food emoji
 */
const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
const desktopBtn = (
    <li class="nav-item">
        <a
            class="nav-link"
            href={speiseplanLink}
            title={LL.features.speiseplan.name()}
        >
            {randomEmoji()}
        </a>
    </li>
);
const mobileBtn = (
    <a class="list-group-item list-group-item-action" href={speiseplanLink}>
        {randomEmoji()}&nbsp;{LL.features.speiseplan.name()}
    </a>
);

/**
 * Gets the current speiseplan as HTML Elements
 * @returns the current speiseplan as HTML Elements
 */
const getCurrentSpeiseplan = () => {
    const lang =
        language.value === 'auto' ? BETTER_MOODLE_LANG : language.value;
    const {
        url: { [lang]: url },
        urlNextWeek: { [lang]: urlNextWeek },
    } = canteens.get(canteen.value)!;

    return Promise.all([parse(url), parse(urlNextWeek)])
        .then(([thisWeek, nextWeek]) => {
            const speiseplan = thisWeek;
            speiseplan.dishes = new Map([
                ...thisWeek.dishes,
                ...nextWeek.dishes,
            ]);
            speiseplan.allergenes = new Map([
                ...thisWeek.allergenes,
                ...nextWeek.allergenes,
            ]);
            speiseplan.additives = new Map([
                ...thisWeek.additives,
                ...nextWeek.additives,
            ]);
            speiseplan.types = new Map([...thisWeek.types, ...nextWeek.types]);

            console.log(speiseplan);
            return speiseplan;
        })
        .then(speiseplan =>
            speiseplan.dishes.entries().map(([day, dishes], index) => (
                <FieldSet
                    title={dateToString(day, false, true)}
                    collapsed={index > 0}
                >
                    <table class={classNames(['table', style.table])}>
                        <thead>
                            <tr>
                                <th>{LL.features.speiseplan.table.dish()}</th>
                                <th>{LL.features.speiseplan.table.types()}</th>
                                <th>{LL.features.speiseplan.table.price()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {...Array.from(
                                dishes.values().map(dish => (
                                    <tr>
                                        <td colSpan={3} class="dish">
                                            <pre>
                                                {JSON.stringify(dish, null, 4)}
                                            </pre>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </FieldSet>
            ))
        )
        .then(fieldsets => <>{...Array.from(fieldsets)}</>);
};

/**
 * Opens the Speiseplan modal and loads content
 */
const openSpeiseplan = () => {
    new Modal({
        type: 'ALERT',
        large: true,
        scrollable: true,
        title: `${randomEmoji()}\xa0${LL.features.speiseplan.name()}`,
        body: getCurrentSpeiseplan(),
        removeOnClose: true,
        buttons: {
            cancel: `🍴\xa0${LL.features.speiseplan.close()}`,
        },
    }).show();
};

desktopBtn.addEventListener('click', e => {
    e.preventDefault();
    openSpeiseplan();
});
mobileBtn.addEventListener('click', e => {
    e.preventDefault();
    openSpeiseplan();
});

/**
 * Adds the btns to desktop and mobile navigation if the setting is enabled.
 */
const onload = async () => {
    if (!enabled.value) return;

    await ready();

    document.querySelector('.dropdownmoremenu')?.before(desktopBtn);
    document
        .querySelector('#theme_boost-drawers-primary .list-group')
        ?.append(mobileBtn);

    console.log(style);
};

/**
 * Removes the btns from navigation.
 */
const onunload = () => {
    desktopBtn.remove();
    mobileBtn.remove();
};

enabled.onInput(() => {
    if (enabled.value) void onload();
    else void onunload();
});

export default FeatureGroup.register({
    settings: new Set([enabled, language, canteen]),
    onload,
    onunload,
});
