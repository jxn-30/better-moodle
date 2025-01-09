import { BooleanSetting } from '@/Settings/BooleanSetting';
import type Canteens from './canteens';
import classNames from 'classnames';
import type { Dish } from './speiseplan';
import FeatureGroup from '@/FeatureGroup';
import { FieldSet } from '@/Components';
import globalStyle from '../../style/index.module.scss';
import { i18nObject } from '../../i18n/i18n-util';
import type { Locales } from '../../i18n/i18n-types';
import { Modal } from '@/Modal';
import Parser from './parsers';
import { PREFIX } from '@/helpers';
import { ready } from '@/DOM';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './style.module.scss';
import { BETTER_MOODLE_LANG, languages, LL } from 'i18n';
import { currency, dateToString, unit } from '@/localeString';

const enabled = new BooleanSetting('enabled', true);
const language = new SelectSetting('language', 'auto', [
    'auto',
    ...languages.entries().map(([locale, { name, flag }]) => ({
        key: locale,
        title: `${flag} ${name}`,
    })),
]);

const sLLs = new Map<Locales, typeof LL>(
    languages.keys().map(locale => [locale, i18nObject(locale)])
);

/**
 * Gets the currently set speiseplan language
 * @returns the current locale
 */
const getLang = () =>
    language.value === 'auto' ?
        BETTER_MOODLE_LANG
    :   (language.value as Locales);

/**
 * Gets a LL instance with the speiseplan language
 * @returns a LL instance
 */
const sLL = () => sLLs.get(getLang())!.features.speiseplan;

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

// textContent will be set on opening
const footerLinkWrapper = (
    <a class="mr-auto" href="#speiseplan" target="_blank">
        Source
    </a>
) as HTMLAnchorElement;

/**
 * Gets the current speiseplan as HTML Elements
 * @returns the current speiseplan as HTML Elements
 */
const getCurrentSpeiseplan = () => {
    const lang = getLang();

    const {
        url: { [lang]: url },
        urlNextWeek: { [lang]: urlNextWeek },
    } = canteens.get(canteen.value)!;

    /**
     * Creates the elements that show the dishs nam
     * @param name - the name
     * @returns the elements
     */
    const getDishNameEls = (name: Dish['name']) =>
        name.map(item => (
            <>
                {item.text}
                {item.info ?
                    <>
                        &nbsp;
                        <span class="text-muted">{item.info}</span>
                    </>
                :   ''}
            </>
        ));

    const co2InfoLink = {
        de: 'https://studentenwerk.sh/de/co2-angaben',
        en: 'https://studentenwerk.sh/en/co2-data',
    }[lang];
    const co2InfoLinkHtml = (
        <a href={co2InfoLink} target="_blank">
            {co2InfoLink}
        </a>
    ).outerHTML;

    footerLinkWrapper.href = url;

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

            return speiseplan;
        })
        .then(speiseplan =>
            speiseplan.dishes.entries().map(([day, dishes], index) => (
                <FieldSet
                    title={dateToString(day, false, true, lang)}
                    collapsed={index > 0}
                >
                    <table class={classNames(['table', style.table])}>
                        <thead>
                            <tr>
                                <th>{sLL().table.dish()}</th>
                                <th>
                                    <span class="d-flex">
                                        {sLL().table.co2score()}
                                        &nbsp;
                                        <a
                                            class={
                                                globalStyle.noExternalLinkIcon
                                            }
                                            href={co2InfoLink}
                                            target="_blank"
                                        >
                                            <i
                                                class="icon fa fa-info-circle text-info fa-fw"
                                                data-toggle="tooltip"
                                                data-placement="auto"
                                                data-html="true"
                                                title={co2InfoLinkHtml}
                                            ></i>
                                        </a>
                                    </span>
                                </th>
                                <th>{sLL().table.types()}</th>
                                <th>
                                    {sLL().table.price()}
                                    &nbsp;
                                    <i
                                        class="icon fa fa-info-circle text-info fa-fw"
                                        data-toggle="tooltip"
                                        data-placement="auto"
                                        title={speiseplan.prices.join(' / ')}
                                    ></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {...Array.from(
                                dishes.values().map(dish => (
                                    <tr>
                                        <td
                                            class="dish"
                                            data-location={dish.location}
                                        >
                                            {...getDishNameEls(dish.name)}
                                            {dish.allergenes.length ?
                                                <>
                                                    <br />
                                                    <span class="text-muted small">
                                                        (
                                                        {dish.allergenes
                                                            .map(
                                                                a =>
                                                                    `${a}:\xa0${speiseplan.allergenes.get(a)}`
                                                            )
                                                            .join(', ')}
                                                        )
                                                    </span>
                                                </>
                                            :   ''}
                                            {dish.additives.length ?
                                                <>
                                                    <br />
                                                    <span class="text-muted small">
                                                        (
                                                        {dish.additives
                                                            .map(
                                                                a =>
                                                                    `${a}:\xa0${speiseplan.additives.get(a)}`
                                                            )
                                                            .join(', ')}
                                                        )
                                                    </span>
                                                </>
                                            :   ''}
                                        </td>
                                        <td
                                            class="co2-score"
                                            data-stars={
                                                dish.co2 ? dish.co2.stars : 0
                                            }
                                        >
                                            {dish.co2 && dish.co2.emission ?
                                                unit(
                                                    dish.co2.emission,
                                                    'gram',
                                                    'long',
                                                    lang
                                                )
                                            :   ''}
                                        </td>
                                        <td class="dish-types">
                                            {...dish.types.map(t => {
                                                const dishType =
                                                    speiseplan.types.get(t);
                                                if (!dishType?.icon) return t;
                                                return (
                                                    <img
                                                        src={dishType.icon.toString()}
                                                        title={dishType.name}
                                                        alt={dishType.name}
                                                    />
                                                );
                                            })}
                                        </td>
                                        <td>
                                            {dish.prices
                                                .map(p =>
                                                    currency(
                                                        p,
                                                        'EUR',
                                                        'symbol',
                                                        lang
                                                    )
                                                )
                                                .join('\xa0/\xa0')}
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
    footerLinkWrapper.textContent = sLL().source();

    const modal = new Modal({
        type: 'ALERT',
        large: true,
        scrollable: true,
        title: `${randomEmoji()}\xa0${sLL().name()}`,
        body: getCurrentSpeiseplan(),
        // setting the footer here would remove the buttons 🤷
        removeOnClose: true,
        buttons: {
            cancel: `🍴\xa0${sLL().close()}`,
        },
    }).show();

    void modal.getBody().then(([body]) => body.classList.add('mform'));

    void modal
        .getFooter()
        .then(([footer]) => footer.prepend(footerLinkWrapper));
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
