import classNames from 'classnames';
import globalStyle from '../style/global.module.scss';
import type { JSX } from 'jsx-dom';
import sliderStyle from '../style/settings/SliderSetting.module.scss';
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
export type SwitchSetting = GenericSetting<boolean, HTMLDivElement>;
type Switch = SwitchSetting['element'];

/**
 * creates a Moodle switch
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @returns the switch element
 */
export const Switch = ({ id, value }: SwitchSetting['props']): Switch => {
    const Input = (
        <input
            className="custom-control-input"
            id={id}
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

    return Switch;
};
// endregion

// region Slider
export type SliderSetting = GenericSetting<
    number,
    HTMLDivElement,
    {
        min: number;
        max: number;
        step: number;
        labels: number | string[];
    }
>;
type Slider = SliderSetting['element'];

/**
 * creates a Moodle switch
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
}: SliderSetting['props']): Slider => {
    const datalistId = `${id}-datalist`;

    const Input = (
        <input
            className="form-control-range custom-range"
            id={id}
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
        // TODO: toLocaleString => use a helper and/or lang
        Output.textContent = valueToLabel.get(value) ?? value.toLocaleString();
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

        const title =
            valueToLabel.get(currentStep) ??
            // TODO: toLocaleString => use a helper and/or lang
            currentStep.toLocaleString();

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
    container: HTMLDivElement;
    heading: HTMLHeadingElement;
    toggle: () => void;
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
    const container = (
        <div
            class={classNames('fcontainer collapseable collapse', {
                show: !collapsed,
            })}
            id={PREFIX(id)}
        >
            {description && (
                <p class="p-12">{htmlToElements(mdToHtml(description))}</p>
            )}
            {children}
        </div>
    ) as HTMLDivElement;

    const collapseBtn = (
        <a
            class={classNames(
                'btn btn-icon mr-1 icons-collapse-expand stretched-link fheader',
                { collapsed }
            )}
            href={`#${container.id}`}
            data-toggle="collapse"
        >
            {/* TODO: Add translated "Einklappen" and "Ausklappen" to spans */}
            <span className="expanded-icon icon-no-margin p-2">
                <i className="icon fa fa-chevron-down fa-fw"></i>
            </span>
            <span
                className="collapsed-icon icon-no-margin p-2"
                title="Ausklappen"
            >
                <span className="dir-rtl-hide">
                    <i
                        className="icon fa fa-chevron-right fa-fw "
                        aria-hidden="true"
                    ></i>
                </span>
                <span className="dir-ltr-hide">
                    <i
                        className="icon fa fa-chevron-left fa-fw "
                        aria-hidden="true"
                    ></i>
                </span>
            </span>
            <span className="sr-only">{title}</span>
        </a>
    ) as HTMLAnchorElement;

    const heading = (
        <h3 className="d-flex align-self-stretch align-items-center mb-0 w-100">
            {title}
        </h3>
    );

    const FieldSet = (
        <fieldset>
            <legend class="sr-only">{title}</legend>
            <div className="d-flex align-items-center mb-2">
                <div class="position-relative d-flex ftoggler align-items-center w-100">
                    {collapseBtn}
                    {heading}
                </div>
            </div>
            {container}
        </fieldset>
    ) as FieldSet;

    Object.defineProperty(FieldSet, 'container', {
        value: container,
    });

    Object.defineProperty(FieldSet, 'heading', {
        value: heading,
    });

    Object.defineProperty(FieldSet, 'toggle', {
        /**
         * Toggle the fieldset
         * @returns undefined
         */
        value: () => collapseBtn.click(),
    });

    return FieldSet;
};
// endregion
