import globalStyle from '../style/global.module.scss';
import { githubPath } from './helpers';
import type { JSX } from 'jsx-dom';
import classNames from 'classnames';

type IntrinsicElements = JSX.IntrinsicElements;
type Anchor = IntrinsicElements['a'];

interface GithubLinkProps extends Anchor {
    path: string;
    icon?: boolean;
    externalIcon?: boolean;
}

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
