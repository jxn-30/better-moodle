import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import type Canteens from './canteens';
import FeatureGroup from '#lib/FeatureGroup';
import globalStyle from '#style/index.module.scss';
import type { Locales } from '../../i18n/i18n-types';
import { Modal } from '#lib/Modal';
import Parser from './parsers';
import { SelectSetting } from '#lib/Settings/SelectSetting';
import style from './style.module.scss';
import { AutoComplete, FieldSet } from '#lib/Components';
import { BETTER_MOODLE_LANG, languages, LLFG, LLMap } from '#i18n';
import { currency, dateToString, timeToString, unit } from '#lib/localeString';
import type { Dish, Speiseplan } from './speiseplan';
import { domID, htmlToElements, mdToHtml } from '#lib/helpers';
import { getHtml, getLoadingSpinner, ready } from '#lib/DOM';

const LL = LLFG('speiseplan');

const FILTER_STORAGE_KEY = 'speiseplan.activeFilters';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.speiseplan'
);
const language = new SelectSetting('language', 'auto', [
    'auto',
    ...languages
        .entries()
        .map(([locale, { name, flag }]) => ({
            key: locale,
            title: `${flag} ${name}`,
        })),
])
    .addAlias('speiseplan.language')
    .disabledIf(enabled, '!=', true);

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
const sLL = () => LLMap.get(getLang()).features.speiseplan;

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
).disabledIf(enabled, '!=', true);

if (__UNI__ === 'cau') {
    canteen.addAlias(
        'speiseplan.canteen',
        old => ['', 'cau1', 'cau2', 'gaarden'][Number(old)] ?? 'cau1'
    );
}

const parse = Object.values(
    import.meta.glob(import.meta.env.VITE_SPEISEPLAN_PARSER_GLOB, {
        import: 'default',
        eager: true,
    })
)[0] as Parser;

// Moodle 405 introduced FA 6
const foodIcons =
    __MOODLE_VERSION__ >= 405 ?
        [
            '\uf094', // lemon
            '\uf578', // fish
            '\ue2cd', // wheat-awn
            '\ue448', // shrimp
            '\uf818', // pizza-slice
            '\uf816', // pepper-hot
            '\uf810', // ice-cream
            '\uf80f', // hotdog
            '\uf7fb', // egg
            '\uf6d7', // drumstick-bite
            '\uf563', // cookie
            '\uf7ef', // cheese
            '\uf787', // carrot
            '\uf805', // burger
            '\uf5d1', // apple-whole
        ]
    :   [
            '\uf0f5', // cutlery
        ];

/**
 * Gets a random food foodIcon from predefined list.
 * @returns a random food foodIcon
 */
const randomFoodIcon = () =>
    foodIcons[Math.floor(Math.random() * foodIcons.length)];
const desktopLink = (
    <a
        className={['nav-link', globalStyle.noExternalLinkIcon, style.foodIcon]}
        href="#speiseplan"
        title={LL.name()}
    >
        {randomFoodIcon()}
    </a>
) as HTMLAnchorElement;
const desktopBtn = <li className="nav-item">{desktopLink} </li>;
const mobileBtn = (
    <a
        className={[
            'list-group-item list-group-item-action',
            globalStyle.noExternalLinkIcon,
        ]}
        href="#speiseplan"
    >
        <span className={style.foodIcon}>{randomFoodIcon()}</span>&nbsp;
        {LL.name()}
    </a>
) as HTMLAnchorElement;

// textContent will be set on opening
const footerLinkWrapper = (
    <a href="#speiseplan" target="_blank">
        Source
    </a>
) as HTMLAnchorElement;
const footerTimeSpan = (<span className="mr-auto"></span>) as HTMLSpanElement;

/**
 * Gets the canteen currently selected
 * @returns the currently selected canteen
 */
const currentCanteen = () => canteens.get(canteen.value)!;

/**
 * Gets the speiseplan URLs to parse from
 * @returns an URL for this and next week
 */
const getCanteenUrls = () => {
    const lang = getLang();

    const {
        url: { [lang]: url },
        urlNextWeek: { [lang]: urlNextWeek },
    } = currentCanteen();

    return { url, urlNextWeek };
};

interface DayProps {
    speiseplan: Speiseplan;
    day: Date;
    dishes: Set<Dish>;
    expanded: boolean;
    co2InfoLink: HTMLAnchorElement;
    lang: Locales;
}
interface DishProps {
    dish: Dish;
}

/**
 * A Component that is a fieldset with a table that contains the dishes of the day
 * @param attributes - the component attributes
 * @param attributes.speiseplan - the speiseplan
 * @param attributes.day - the timestamp of day to create the fieldset for
 * @param attributes.dishes - a set of the dishes of the day
 * @param attributes.expanded - wether this fieldset should be expanded
 * @param attributes.co2InfoLink - the element that links to more infos about CO₂
 * @param attributes.lang - the speiseplan language
 * @returns the fieldset
 */
const Day = ({
    speiseplan,
    day,
    dishes,
    expanded,
    co2InfoLink,
    lang,
}: DayProps) => {
    /**
     * A Component that is the table row of a dish
     * @param attributes -  the component attributes
     * @param attributes.dish - the dish
     * @returns a table row
     */
    const Dish = ({ dish }: DishProps) => (
        <tr dataset={{ types: dish.types.values().toArray().join(' ') }}>
            <td className="dish" dataset={{ location: dish.location }}>
                {...dish.name.map(item => (
                    <>
                        {item.text}
                        {item.info ?
                            <>
                                &nbsp;
                                <span className="text-muted">
                                    {item.info}
                                </span>{' '}
                            </>
                        :   ''}
                    </>
                ))}
                {dish.allergenes.length ?
                    <>
                        <br />
                        <span className="text-muted small">
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
                        <span className="text-muted small">
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
                className="co2-score"
                dataset={{ stars: dish.co2 ? dish.co2.stars.toString() : '0' }}
            >
                <span></span>
                {dish.co2 && dish.co2.emission ?
                    unit(dish.co2.emission, 'gram', 'long', lang)
                :   ''}
            </td>
            <td className="dish-types">
                {...dish.types.map(t => {
                    const dishType = speiseplan.types.get(t);
                    if (!dishType?.icon) return t;
                    return (
                        <img
                            className={style.dishImg}
                            src={dishType.icon.toString()}
                            title={dishType.name}
                            alt={dishType.name}
                        />
                    );
                })}
            </td>
            <td>
                {dish.prices
                    .map(p => currency(p, 'EUR', 'symbol', lang))
                    .join('\xa0/\xa0')}
            </td>
        </tr>
    );

    return (
        <FieldSet
            title={dateToString(day, false, true, getLang())}
            collapsed={!expanded}
        >
            <table className={['table', style.table]}>
                <thead>
                    <tr>
                        <th>{sLL().table.dish()}</th>
                        <th>
                            <span className="d-flex">
                                {sLL().table.co2score()}
                                &nbsp;
                                {co2InfoLink}
                            </span>
                        </th>
                        <th>{sLL().table.types()}</th>
                        <th>
                            {sLL().table.price()}
                            &nbsp;
                            <i
                                className="icon fa fa-info-circle text-info fa-fw"
                                dataset={{
                                    toggle: 'tooltip',
                                    placement: 'auto',
                                }}
                                title={speiseplan.prices.join(' / ')}
                            ></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {...Array.from(
                        dishes.values().map(dish => <Dish dish={dish}></Dish>)
                    )}
                </tbody>
            </table>
        </FieldSet>
    ) as ReturnType<typeof FieldSet>;
};

/**
 * Gets the current speiseplan as HTML Elements
 * @returns the current speiseplan as HTML Elements
 */
const getCurrentSpeiseplan = () => {
    const lang = getLang();

    const { url, urlNextWeek } = getCanteenUrls();

    desktopLink.href = mobileBtn.href = url;

    const co2InfoLink = {
        'de': 'https://studentenwerk.sh/de/co2-angaben',
        'en-gb': 'https://studentenwerk.sh/en/co2-data',
    }[lang];

    const co2InfoLinkAnchor = (
        <a
            className={globalStyle.noExternalLinkIcon}
            href={co2InfoLink}
            target="_blank"
        >
            <i
                className="icon fa fa-info-circle text-info fa-fw"
                dataset={{ toggle: 'tooltip', placement: 'auto', html: 'true' }}
                title={co2InfoLink}
            ></i>
        </a>
    ) as HTMLAnchorElement;

    footerLinkWrapper.href = url;

    const filtersFieldset = (
        <FieldSet
            title={getHtml(
                <>
                    <i className="fa fa-filter fa-fw mr-1"></i>
                    {LL.filters.title()}
                </>
            )}
            description={LL.filters.description()}
        ></FieldSet>
    ) as ReturnType<typeof FieldSet>;

    filtersFieldset.id = 'speiseplan-filters-fieldset';

    /**
     * Creates the filters autocomplete component
     * Adds and initializes it when calling the returned method
     * @param speiseplan - the current speiseplan to read the dish types from
     * @returns a promise that resolves to the initialising function
     */
    const createFilters = (speiseplan: Speiseplan) => {
        // it seems like we have to use a random ID as modals are not always fully destroyed?
        const id = domID(`speiseplan-filters-${crypto.randomUUID()}`);

        const filtersElement = (
            <AutoComplete
                id={id}
                value={GM_getValue<string[]>(FILTER_STORAGE_KEY, [])}
                placeholder={LL.filters.placeholder()}
                options={speiseplan.types
                    .entries()
                    .filter(([, { isExclusive }]) => !isExclusive)
                    .map(([value, { name, icon }]) => ({
                        value,
                        text: name,
                        html: getHtml(
                            <span>
                                {icon ?
                                    <img
                                        className={style.dishImg}
                                        src={icon.toString()}
                                        alt={name}
                                    />
                                :   null}
                                {name}
                            </span>
                        ),
                    }))
                    .toArray()}
            />
        ) as ReturnType<typeof AutoComplete>;

        filtersElement.addEventListener('change', () => {
            GM_setValue(FILTER_STORAGE_KEY, filtersElement.value);
            updateFilterStyle(filtersElement.value);
        });

        updateFilterStyle();

        return () => filtersFieldset.appendToContainer(filtersElement);
    };

    let firstDay: Date | undefined;

    /**
     * Gets the index of the day to expand
     * @returns the index of the day to expand
     */
    const getExpandedDay = () =>
        Number(
            new Date().toDateString() === firstDay?.toDateString() &&
                new Date().getHours() >= currentCanteen().closingHour
        );

    return Promise.all([parse(url), parse(urlNextWeek)])
        .then(([thisWeek, nextWeek]) => {
            footerTimeSpan.textContent = timeToString(
                new Date(thisWeek.timestamp)
            );

            firstDay = thisWeek.dishes.keys().next().value;

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
        .then(speiseplan => {
            if (speiseplan.dishes.size === 0) {
                return [
                    [<p>{LL.isEmpty()}</p>],
                    createFilters(speiseplan),
                ] as const;
            }

            const fieldsets = speiseplan.dishes
                .entries()
                .map(
                    ([day, dishes], index) =>
                        (
                            <Day
                                speiseplan={speiseplan}
                                day={day}
                                dishes={dishes}
                                expanded={index === getExpandedDay()}
                                co2InfoLink={
                                    co2InfoLinkAnchor.cloneNode(
                                        true
                                    ) as HTMLAnchorElement
                                }
                                lang={lang}
                            ></Day>
                        ) as ReturnType<typeof Day>
                )
                .toArray();
            return [
                [filtersFieldset, ...fieldsets],
                createFilters(speiseplan),
            ] as const;
        });
};

const filterStyle = <style></style>;
/**
 * Updates the filtering style to hide dishes that do not match the current filters
 * @param activeFilters - the list of current filters
 */
const updateFilterStyle = (
    activeFilters = GM_getValue<string[]>(FILTER_STORAGE_KEY, [])
) => {
    if (!activeFilters.length) {
        filterStyle.textContent = '';
        return;
    }

    filterStyle.textContent = `
    tr${activeFilters.map(f => `:not([data-types~="${f}"])`).join('')} {
        display: none;
    }`;
};

/**
 * Opens the Speiseplan modal and loads content
 */
const openSpeiseplan = () => {
    footerLinkWrapper.textContent = sLL().source();

    let initialCreateFilters: () => Promise<void>;

    const modal = new Modal({
        type: 'ALERT',
        large: true,
        scrollable: true,
        title: (
            <>
                <span className={style.foodIcon}>{randomFoodIcon()}</span>&nbsp;
                {sLL().name()}
            </>
        ),
        body: getCurrentSpeiseplan()
            .then(([fieldsets, createFilters]) => {
                initialCreateFilters = createFilters;
                return (
                    <>
                        {filterStyle}
                        {...Array.from(fieldsets)}
                    </>
                );
            })
            .catch(error => (
                <>
                    {htmlToElements(
                        mdToHtml(sLL().errorWhileFetching({ error }))
                    )}
                </>
            )),
        bodyClass: 'mform',
        // setting the footer here would remove the buttons 🤷
        removeOnClose: true,
        buttons: { cancel: `🍴\xa0${sLL().close()}` },
    }).show();

    void modal.getBody().then(() => initialCreateFilters?.());

    void modal
        .getFooter()
        .then(([footer]) =>
            footer.prepend(footerLinkWrapper, ' ⋅ ', footerTimeSpan)
        );

    /**
     * Updates the modal body to the latest menu respecting curent settings
     * @returns a Promise
     */
    const updateSpeiseplan = () =>
        Promise.all([modal.getBody(), getLoadingSpinner()]).then(
            ([[body], spinner]) => {
                body.replaceChildren(spinner);
                footerLinkWrapper.textContent = sLL().source();
                return getCurrentSpeiseplan()
                    .then(([fieldsets, createFilters]) => {
                        body.replaceChildren(filterStyle, ...fieldsets);
                        void createFilters?.();
                    })
                    .catch(error =>
                        body.replaceChildren(
                            ...htmlToElements(
                                mdToHtml(sLL().errorWhileFetching({ error }))
                            )
                        )
                    );
            }
        );

    const canteenSelection = canteen.formControl.cloneNode(
        true
    ) as HTMLSelectElement;
    canteenSelection.classList.add('flex-grow-1', 'custom-select-sm');
    canteenSelection.value = canteen.formControl.value;
    canteenSelection.addEventListener('change', () => {
        canteen.formControl.value = canteenSelection.value;
        canteen.formControl.dispatchEvent(new Event('change'));
        canteen.save();
        void updateSpeiseplan();
    });

    const languageSelection = language.formControl.cloneNode(
        true
    ) as HTMLSelectElement;
    languageSelection.classList.add('flex-grow-1', 'custom-select-sm');
    languageSelection.value = language.formControl.value;
    languageSelection.addEventListener('change', () => {
        language.formControl.value = languageSelection.value;
        language.formControl.dispatchEvent(new Event('change'));
        language.save();
        void updateSpeiseplan();
    });

    void modal.getTitle().then(title =>
        title.after(
            <div
                className="mx-auto px-2 d-flex flex-wrap"
                style={{ columnGap: '5px' }}
            >
                {canteenSelection}
                {languageSelection}
            </div>
        )
    );
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
const reload = async () => {
    if (!enabled.value) {
        desktopBtn.remove();
        mobileBtn.remove();
        return;
    }

    await ready();

    desktopLink.href = mobileBtn.href = getCanteenUrls().url;

    document.querySelector('.dropdownmoremenu')?.before(desktopBtn);
    document
        .querySelector('#theme_boost-drawers-primary .list-group')
        ?.append(mobileBtn);
};

enabled.onInput(() => void reload());

export default FeatureGroup.register({
    settings: new Set([enabled, language, canteen]),
    onload: reload,
    onunload: reload,
});
