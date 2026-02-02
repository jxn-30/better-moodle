import { FeatureGroupID } from './FeatureGroup';
import { FeatureID } from './Feature';
import globalStyle from '#style/index.module.scss';
import type { JSX } from 'jsx-dom';
import { renderAsElements } from './templates';
import { requirePromise } from '#lib/require.js';
import { SettingTranslations } from './Setting';
import { SimpleReady } from './CanBeReady';
import sliderStyle from '#style/settings/SliderSetting.module.scss';
import { stringify } from '../i18n/i18n';
import { getLoadingSpinner, ready } from './DOM';
import { githubPath, htmlToElements, mdToHtml, PREFIX } from './helpers';

type IntrinsicElements = JSX.IntrinsicElements;
type Anchor = IntrinsicElements['a'];
type Input = IntrinsicElements['input'];
type HTMLFieldSet = IntrinsicElements['fieldset'];
type HTMLDiv = IntrinsicElements['div'];

// region GithubLink
interface GithubLinkProps extends Anchor {
    path: string;
    icon?: boolean;
    externalIcon?: boolean;
}

/**
 * A Component linking to a specific path in the Better-Moodle GitHub Repo
 * @param attributes - any attributes the HTMLAnchorElement will have plus few additional
 * @param attributes.path - the absolute path on GitHub beginning at the repos root
 * @param attributes.icon - whether to show the GitHub icon
 * @param attributes.externalIcon - whether to allow the icon indicating an external link to be shown
 * @param attributes.className - additional classes
 * @param attributes.children - any children of this component
 * @returns HTMLAnchorElement
 */
export const GithubLink = ({
    path,
    icon = true,
    externalIcon = false,
    className,
    children,
    ...props
}: GithubLinkProps) => (
    <a
        href={githubPath(path)}
        target="_blank"
        className={[
            // @ts-expect-error - className may not be iterable according to types
            className,
            { [globalStyle.noExternalLinkIcon]: !externalIcon },
        ]}
        {...props}
    >
        {/* if icon */}
        {icon && <i className="fa fa-github fa-fw"></i>}
        {/* passing possible children */}
        {children}
    </a>
);
// endregion

// region
interface NavbarItemProps extends HTMLDiv {
    order: number;
}
export interface NavbarItemComponent extends HTMLDivElement {
    put(): void;
}

/**
 * Creates an item that lives in the moodle navbar.
 * @param attributes - the element attributes
 * @param attributes.order - where to position this in the navbar, should be 1 ≤ order ≤ 998 for best results
 * @param attributes.children - children for this navbar item
 * @param attributes.className - additional classes
 * @returns the navbarItem
 */
export const NavbarItem = ({
    order,
    children,
    className,
    ...props
}: NavbarItemProps) => {
    const item = (
        // @ts-expect-error - className may not be iterable according to types
        <div className={[className, globalStyle.navbarItem]} {...props}>
            {children}
        </div>
    ) as NavbarItemComponent;
    item.style.setProperty('order', order.toString());

    Object.defineProperty(item, 'put', {
        /**
         * Appends the element to the navbar
         * @returns void
         */
        value: () =>
            ready().then(() =>
                document.getElementById('usernavigation')?.append(item)
            ),
    });

    return item;
};
// endregion

// region Settings inputs
type GenericSettingProps<Type, Props extends Record<string, unknown>> = Omit<
    Input,
    'value'
> &
    Props & { value: Type };
type GenericSettingElement<Type, Base extends JSX.Element> = Base & {
    value: Type;
    disabled: boolean;
};
export interface GenericSetting<
    Type,
    Base extends JSX.Element,
    Props extends Record<string, unknown> = Record<string, unknown>,
> {
    create: (
        props: GenericSettingProps<Type, Props>
    ) => GenericSettingElement<Type, Base>;
    props: GenericSettingProps<Type, Props>;
    element: GenericSettingElement<Type, Base>;
    params: Props;
}

// region Switch
export type SwitchComponent = GenericSetting<boolean, HTMLDivElement>;
type Switch = SwitchComponent['element'];

/**
 * creates a Moodle switch
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @returns the switch element
 */
export const Switch = ({ id, value }: SwitchComponent['props']): Switch => {
    const Input = (
        <input
            id={id}
            className="custom-control-input"
            type="checkbox"
            checked={value}
        />
    ) as HTMLInputElement;

    const Switch = (
        <div className="custom-control custom-switch">
            {Input}
            <label className="custom-control-label" htmlFor={id}>
                {/* nothing*/}
            </label>
        </div>
    ) as Switch;

    Object.defineProperty(Switch, 'value', {
        /**
         * getter for the current value of the switch
         * @returns the current value of the switch
         */
        get() {
            return Input.checked;
        },
        /**
         * setter for the current value of the switch
         * @param newVal - the new value of the switch
         */
        set(newVal: boolean) {
            Input.checked = newVal;
        },
    });

    Object.defineProperty(Switch, 'disabled', {
        /**
         * getter for the current disabled state of the switch
         * @returns the current disabled state of the switch
         */
        get() {
            return Input.disabled;
        },
        /**
         * setter for the disabled state of the switch
         * @param newVal - the new disabled state of the switch
         */
        set(newVal: boolean) {
            Input.disabled = newVal;
        },
    });

    return Switch;
};
// endregion

// region Text input
export type TextComponent = GenericSetting<string, HTMLInputElement>;
type TextInput = TextComponent['element'];

/**
 * Creates a textual input component
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @returns the input element
 */
export const TextInput = ({ id, value }: TextComponent['props']): TextInput =>
    (
        <input id={id} className="form-control" type="text" value={value} />
    ) as HTMLInputElement;
// endregion

// region Select
export type SelectOption = string | { key: string; title: string };
export type SelectComponent<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
> = GenericSetting<
    string,
    Select<Group, Feat>,
    { options: SelectOption[] | Promise<SelectOption[]> }
>;
type Select<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
> = HTMLSelectElement & {
    applyTranslations: (translations: SettingTranslations<Group, Feat>) => void;
    optionsLoaded: boolean;
};

/**
 * creates a Select input
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @param attributes.options - the options of this select
 * @returns the switch element
 */
export const Select = <
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
>({
    id,
    value,
    options,
}: SelectComponent<Group, Feat>['props']): Select<Group, Feat> => {
    const Select = (
        <select id={id} className="custom-select col-12 col-md-auto"></select>
    ) as Select<Group, Feat>;

    const optionsPromise =
        options instanceof Promise ? options : Promise.resolve(options);

    const optionsToBeTranslated = new Set<HTMLOptionElement>();

    const waitForOptions = new SimpleReady();

    const loadingOption = (
        <option selected disabled>
            Loading...
        </option>
    ) as HTMLOptionElement;
    void getLoadingSpinner().then(spinner => loadingOption.append(spinner));
    Select.append(loadingOption);

    void optionsPromise
        .then(options =>
            options.forEach(option => {
                let optionValue: string;
                let title: string;
                if (typeof option === 'string') {
                    optionValue = option;
                    title = `settings.${id}.options.${option}`;
                } else {
                    optionValue = option.key;
                    title = option.title;
                }
                const selected = optionValue === value;
                const el = (
                    <option value={optionValue} selected={selected}>
                        {title}
                    </option>
                ) as HTMLOptionElement;
                Select.append(el);

                if (typeof option === 'string') {
                    optionsToBeTranslated.add(el);
                }
            })
        )
        .then(() => loadingOption.remove())
        .then(() => waitForOptions.ready());

    /**
     * Modifies the options of the select element to be translated if necessary
     * @param translations - the translations object for this setting
     * @returns undefined
     */
    const translate = (translations: SettingTranslations<Group, Feat>) =>
        optionsToBeTranslated.forEach(option => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            option.textContent =
                // @ts-expect-error still some issues with translation types
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                translations.options[option.value]() ?? option.textContent;
        });

    Object.defineProperty(Select, 'applyTranslations', {
        /**
         * Modifies the options of the select element to be translated if necessary
         * @param translations - the translations object for this setting
         * @returns undefined
         */
        value: (translations: SettingTranslations<Group, Feat>) =>
            waitForOptions.awaitReady().then(() => translate(translations)),
    });
    Object.defineProperty(Select, 'optionsLoaded', {
        /**
         * Returns wether options are already loaded or not
         * @returns a boolean
         */
        get: () => waitForOptions.instanceIsReady,
    });

    return Select;
};
// endregion

// region AutoComplete / MultiSelect
export interface AutoCompleteOption {
    value: string;
    selected?: boolean;
    html?: string;
    text: string;
}
export type AutoCompleteComponent<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
> = GenericSetting<
    string[],
    AutoComplete<Group, Feat>,
    {
        options: AutoCompleteOption[] | Promise<AutoCompleteOption[]>;
        multiple?: boolean;
        tags?: boolean;
        placeholder?: string | Promise<string>;
    }
>;
type AutoComplete<
    Group extends FeatureGroupID,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Feat extends FeatureID<Group>,
> = HTMLSelectElement & { value: string[]; initialized: boolean };

/**
 * creates an autocomplete input
 * uses a normal select as the base and initializes it once added to DOM
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @param attributes.options - the options of this select
 * @param attributes.multiple - whether multiple values can be selected at once
 * @param attributes.tags - whether the user can define new values
 * @param attributes.placeholder - a custom text that will be the placeholder of the input field
 * @returns the basis select element
 */
export const AutoComplete = <
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
>({
    id,
    value,
    options,
    multiple = true,
    tags = false,
    placeholder = '',
}: AutoCompleteComponent<Group, Feat>['props']): AutoComplete<Group, Feat> => {
    const Select = (
        <select id={id} multiple={multiple}></select>
    ) as AutoComplete<Group, Feat>;
    const waitForOptions = new SimpleReady();

    void Promise.resolve(options).then(options => {
        Select.append(
            ...options.map(option => (
                <option
                    value={option.value}
                    selected={value.includes(option.value)}
                    data-html={option.html}
                >
                    {option.text}
                </option>
            ))
        );
        waitForOptions.ready();
    });

    let initing = false;

    // initialize whenever the select gets added to the document
    new MutationObserver((records, observer) =>
        records.forEach(record => {
            if (initing) return;
            if (record.type !== 'childList') return;
            if (!record.addedNodes.values().find(el => el === Select)) return;
            observer.disconnect();
            initing = true;
            void waitForOptions
                .awaitReady()
                .then(() => requirePromise(['core/form-autocomplete'] as const))
                .then(([{ enhanceField }]) =>
                    enhanceField(
                        `#${id}`,
                        tags,
                        undefined, // for now only components without extra ajax are supported.
                        placeholder
                    )
                )
                .then(() => (initing = false));
        })
    ).observe(document, { subtree: true, childList: true });

    Object.defineProperty(Select, 'value', {
        /**
         * Extracts the current value of the component
         * @returns an array of the currently active option values
         */
        get() {
            return Array.from(Select.selectedOptions).map(
                option => option.value
            );
        },
        /**
         * Sets a new value of the component
         * @param newValue - an array of the option values that should be active.
         * @throws {Error} if any of the required DOM elements are not found
         */
        set(newValue: string[]) {
            const selectionElement =
                Select.parentElement?.querySelector<HTMLDivElement>(
                    '.form-autocomplete-selection'
                );
            const suggestionsElement =
                Select.parentElement?.querySelector<HTMLDivElement>(
                    '.form-autocomplete-suggestions'
                );
            if (!selectionElement || !suggestionsElement) {
                throw new Error(
                    "Couldn't find required elements in autocomplete!"
                );
            }

            // first, deselect old values
            selectionElement
                .querySelectorAll<HTMLSpanElement>(
                    `[role="option"]${newValue.map(v => `:not([data-value="${v}"])`).join('')}`
                )
                .forEach(el => el.click());

            // now select new values
            suggestionsElement
                .querySelectorAll<HTMLLIElement>(
                    `[role="option"]:is(${newValue.map(v => `[data-value="${v}"]`).join(',')})`
                )
                .forEach(el => el.click());
        },
    });

    return Select;
};
// endregion

// region Slider
export type SliderComponent<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
    ST extends SettingTranslations<Group, Feat> = SettingTranslations<
        Group,
        Feat
    >,
> = GenericSetting<
    number,
    Slider<Group, Feat, ST>,
    { min: number; max: number; step: number; labels: number | string[] }
>;
type Slider<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
    ST extends SettingTranslations<Group, Feat> = SettingTranslations<
        Group,
        Feat
    >,
> = HTMLDivElement & {
    value: number;
    disabled: boolean;
    applyTranslations: (
        translations: ST extends { labels: Record<string, unknown> } ?
            ST['labels']
        :   never
    ) => void;
};

/**
 * creates a Slider component
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @param attributes.min - the minimum value of the slider
 * @param attributes.max - the maximum value of the slider
 * @param attributes.step - the step size of the slider
 * @param attributes.labels - the amount of labels to show below the slider or an array of label keys
 * @returns the switch element
 */
export const Slider = <
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
    ST extends SettingTranslations<Group, Feat> = SettingTranslations<
        Group,
        Feat
    >,
>({
    id,
    value,
    min,
    max,
    step = 1,
    labels = (max - min + 1) / step,
}: SliderComponent<Group, Feat, ST>['props']): Slider<Group, Feat, ST> => {
    const datalistId = `${id}-datalist`;

    const Input = (
        <input
            id={id}
            className="form-control-range custom-range"
            type="range"
            min={min}
            max={max}
            step={step}
            list={datalistId}
            value={value}
        />
    ) as HTMLInputElement;

    // create the output element and a function that updates it.
    const Output = (<output htmlFor={id}>{value}</output>) as HTMLOutputElement;
    /**
     * Updates the output element with the current value of the slider.
     * Set's both the text content and the position of the output element.
     */
    const setOutput = () => {
        const value = Number(Input.value);
        const percentageValue = ((value - min) / (max - min)) * 100;
        Output.textContent = valueToLabel.get(value) ?? stringify(value);
        Output.style.setProperty('--percentage', percentageValue.toString());
    };

    // create and fill the datalist specifying the possible values
    const datalist = <datalist id={datalistId}></datalist>;
    const steps = (max - min + 1) / step;
    for (
        let currentStep = min;
        currentStep <= max;
        currentStep += (max - min + 1) / steps
    ) {
        datalist.append(<option value={currentStep}>{currentStep}</option>);
    }

    // create and fill the datalist specifying the labels shown below the data list
    const fixLabels = Array.isArray(labels);
    const labelCount =
        Array.isArray(labels) ?
            labels.length
        :   Math.max(2, Math.min(10, labels)); // minimum 2, maximum 10 labels
    const valueToLabel = new Map<number, string>();
    const labelDatalist = (
        // @ts-expect-error as the types do not allow css variables / custom properties yet.
        <datalist style={{ '--label-count': labelCount }}></datalist>
    );

    const Slider = (
        <div className={['w-100 position-relative', sliderStyle.sliderSetting]}>
            {Input}
            {Output}
            {datalist}
            {labelDatalist}
        </div>
    ) as Slider<Group, Feat>;

    Object.defineProperty(Slider, 'value', {
        /**
         * getter for the current value of the slider
         * @returns the current value of the slider
         */
        get(): number {
            return Number(Input.value);
        },
        /**
         * setter for the current value of the slider
         * @param newVal - the new value of the slider
         */
        set(newVal: number) {
            Input.value = newVal.toString();
            setOutput();
        },
    });

    Object.defineProperty(Slider, 'disabled', {
        /**
         * getter for the current disabled state of the slider
         * @returns the current disabled state of the slider
         */
        get() {
            return Input.disabled;
        },
        /**
         * setter for the disabled state of the slider
         * @param newVal - the new disabled state of the slider
         */
        set(newVal: boolean) {
            Input.disabled = newVal;
        },
    });

    Object.defineProperty(Slider, 'applyTranslations', {
        /**
         * Creates the labels with their respective translations
         * @param translations - the label translations to use
         */
        value: (
            translations: ST extends { labels: Record<string, unknown> } ?
                ST['labels']
            :   Record<'', never>
        ) => {
            if (!translations) return;

            for (
                let currentStep = min;
                currentStep <= max;
                currentStep += (max - min) / (labelCount - 1)
            ) {
                if (fixLabels) {
                    const label = labels.shift();
                    valueToLabel.set(
                        currentStep,
                        // @ts-expect-error as typed translations are wild
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
                        translations[label]?.() ?? label
                    );
                }

                const title =
                    valueToLabel.get(currentStep) ?? stringify(currentStep);

                labelDatalist.append(
                    <option
                        value={currentStep}
                        title={title}
                        label={title}
                    ></option>
                );
            }

            Output.textContent = valueToLabel.get(value) ?? stringify(value);
        },
    });

    // we want to update the output element whenever the slider is moved
    Input.addEventListener('input', setOutput);

    // initially set the value
    Slider.value = value;

    return Slider;
};
// endregion
// endregion

// region FieldSet
interface FieldSetProps extends HTMLFieldSet {
    title: string;
    description?: string;
    collapsed?: boolean;
}

interface FieldSet extends HTMLFieldSetElement {
    heading: Promise<HTMLHeadingElement | null>;
    toggle: () => void;
    appendToContainer: (
        ...args: Parameters<typeof HTMLFieldSetElement.prototype.append>
    ) => Promise<void>;
    awaitReady: () => Promise<void>;
}

/**
 * Creates a Fieldset (a collapsible container)
 * @param attributes - the fieldset attributes
 * @param attributes.title - title of the fieldset shown in a heading element
 * @param attributes.description - optional description shown in a paragraph as first child
 * @param attributes.id - the id of the fieldset
 * @param attributes.collapsed - whether the fieldset is collapsed by default
 * @param attributes.children - any children of the fieldset
 * @returns a fieldset element with some additional properties and methods
 */
export const FieldSet = ({
    title,
    description = '',
    id = crypto.randomUUID(),
    collapsed = true,
    children = document.createDocumentFragment().children, // this is a funny way to get an empty HTMLCollection
}: FieldSetProps): FieldSet => {
    const FieldSet = (<fieldset></fieldset>) as FieldSet;
    let container: HTMLDivElement | null;
    let heading: HTMLHeadingElement | null;
    const waitForContainer = new SimpleReady();

    void renderAsElements('core_form/element-header', {
        header: title,
        id: PREFIX(id),
        collapseable: true,
        collapsed,
    })
        .then(elements => FieldSet.append(...Array.from(elements)))
        .then(() => {
            container = FieldSet.querySelector<HTMLDivElement>('.fcontainer');
            container?.append(
                <>
                    {description ? htmlToElements(mdToHtml(description)) : null}
                    {children}
                </>
            );
            heading = FieldSet.querySelector<HTMLHeadingElement>('h3');
            waitForContainer.ready();
        });

    Object.defineProperty(FieldSet, 'appendToContainer', {
        /**
         * Appends elements to the container of the fieldset.
         * @param args - the elements to append to the container
         * @returns a promise that resolves when the elements are appended
         */
        value: (...args: Parameters<FieldSet['appendToContainer']>) =>
            waitForContainer
                .awaitReady()
                .then(() => container?.append(...args)),
    });

    Object.defineProperty(FieldSet, 'heading', {
        value: waitForContainer.awaitReady().then(() => heading),
    });

    Object.defineProperty(FieldSet, 'toggle', {
        /**
         * Toggle the fieldset
         * @returns undefined
         */
        value: () =>
            FieldSet.querySelector<HTMLAnchorElement>(
                '[data-toggle="collapse"]'
            )?.click(),
    });

    Object.defineProperty(FieldSet, 'awaitReady', {
        /**
         * Wait for the container to be ready
         * @returns a promise that resolves when container is ready
         */
        value: () => waitForContainer.awaitReady(),
    });

    return FieldSet;
};
// endregion
