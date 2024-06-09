import globalStyle from '../style/global.module.scss';
import { githubPath } from './helpers';

interface GithubLinkProps {
    path: string;
    icon?: boolean;
    externalIcon?: boolean;
}

export const GithubLink = ({
    path,
    icon = true,
    externalIcon = false,
}: GithubLinkProps) => (
    <a
        href={githubPath(path)}
        target="_blank"
        class={!externalIcon && globalStyle.noExternalLinkIcon}
    >
        {/* if icon */}
        {icon && <i class="fa fa-github fa-fw"></i>}
    </a>
);
