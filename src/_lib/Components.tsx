import classNames from 'classnames';
import { FeatureGroupID } from './FeatureGroup';
import { FeatureID } from './Feature';
import { getLoadingSpinner } from './DOM';
import globalStyle from '../style/global.module.scss';
import type { JSX } from 'jsx-dom';
import { requirePromise } from './require.js';
import { SettingTranslations } from './Setting';
import { SimpleReady } from './CanBeReady';
import sliderStyle from '../style/settings/SliderSetting.module.scss';
import { stringify } from '../i18n/i18n';
import { githubPath, htmlToElements, mdToHtml, PREFIX } from './helpers';

type IntrinsicElements = JSX.IntrinsicElements;
type Anchor = IntrinsicElements['a'];
type Input = IntrinsicElements['input'];
type HTMLFieldSet = IntrinsicElements['fieldset'];

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
 * @param attributes.class - additional classes
 * @param attributes.children - any children of this component
 * @returns HTMLAnchorElement
 */
export const GithubLink = ({
    path,
    icon = true,
    externalIcon = false,
    class: className,
    children,
    ...props
}: GithubLinkProps) => (
    <a
        href={githubPath(path)}
        target="_blank"
        class={classNames(className, {
            [globalStyle.noExternalLinkIcon]: !externalIcon,
        })}
        {...props}
    >
        {/* if icon */}
        {icon && <i class="fa fa-github fa-fw"></i>}
        {/* passing possible children */}
        {children}
    </a>
);
// endregion

// region Settings inputs
type GenericSettingProps<Type, Props extends Record<string, unknown>> = Omit<
    Input,
    'value'
> &
    Props & {
        value: Type;
    };
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

// region Select
export type SelectOption = string | { key: string; title: string };
export type SelectComponent<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
> = GenericSetting<
    string,
    Select<Group, Feat>,
    {
        options: SelectOption[] | Promise<SelectOption[]>;
    }
>;
type Select<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
> = HTMLSelectElement & {
    applyTranslations: (translations: SettingTranslations<Group, Feat>) => void;
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

    return Select;
};
// endregion

// region Slider
export type SliderComponent = GenericSetting<
    number,
    HTMLDivElement,
    {
        min: number;
        max: number;
        step: number;
        labels: number | string[];
    }
>;
type Slider = SliderComponent['element'];

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
export const Slider = ({
    id,
    value,
    min,
    max,
    step = 1,
    labels = (max - min + 1) / step,
}: SliderComponent['props']): Slider => {
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
        fixLabels ? labels.length : Math.max(2, Math.min(10, labels)); // minimum 2, maximum 10 labels
    const valueToLabel = new Map<number, string>();
    const labelDatalist = (
        // @ts-expect-error as the types do not allow css variables / custom properties yet.
        <datalist style={{ '--label-count': labelCount }}></datalist>
    );

    for (
        let currentStep = min;
        currentStep <= max;
        currentStep += (max - min) / (labelCount - 1)
    ) {
        if (fixLabels) {
            valueToLabel.set(
                currentStep,
                // TODO: Translations
                `settings.${id}.labels.${labels.shift()}`
            );
        }

        const title = valueToLabel.get(currentStep) ?? stringify(currentStep);

        labelDatalist.append(
            <option value={currentStep} title={title} label={title}></option>
        );
    }

    const Slider = (
        <div
            className={classNames(
                'w-100 position-relative',
                sliderStyle.sliderSetting
            )}
        >
            {Input}
            {Output}
            {datalist}
            {labelDatalist}
        </div>
    ) as Slider;

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

    void requirePromise(['core/templates'] as const).then(([templates]) =>
        templates
            .renderForPromise('core_form/element-header', {
                header: title,
                id: PREFIX(id),
                collapseable: true,
                collapsed,
            })
            .then(({ html }) =>
                FieldSet.append(...Array.from(htmlToElements(html)))
            )
            .then(() => {
                container =
                    FieldSet.querySelector<HTMLDivElement>('.fcontainer');
                container?.append(
                    <>
                        {description && (
                            <p class="p-12">
                                {htmlToElements(mdToHtml(description))}
                            </p>
                        )}
                        {children}
                    </>
                );
                heading = FieldSet.querySelector<HTMLHeadingElement>('h3');
                waitForContainer.ready();
            })
    );

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

    return FieldSet;
};
// endregion
