import classNames from 'classnames';
import globalStyle from '../style/global.module.scss';
import type { JSX } from 'jsx-dom';
import { githubPath, PREFIX } from './helpers';

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

// region Switch
interface SwitchProps extends Omit<Input, 'value'> {
    value: boolean;
}

interface Switch extends HTMLDivElement {
    value: boolean;
}

/**
 * creates a Moodle switch
 * @param attributes - the input element attributes
 * @param attributes.id - the id of the input element
 * @param attributes.value - the initial value of the input element
 * @returns the switch element
 */
export const Switch = ({ id, value }: SwitchProps): Switch => {
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

// region FieldSet
interface FieldSetProps extends HTMLFieldSet {
    title: string;
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
 * @param attributes.id - the id of the fieldset
 * @param attributes.collapsed - whether the fieldset is collapsed by default
 * @param attributes.children - any children of the fieldset
 * @returns a fieldset element with some additional properties and methods
 */
export const FieldSet = ({
    title,
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
            {children}
        </div>
    );

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
