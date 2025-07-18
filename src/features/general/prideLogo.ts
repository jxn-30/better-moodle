import Feature from '@/Feature';
import { ready } from '@/DOM';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './prideLogo.module.scss';

const flags = Object.keys(style)
    .filter(className => className.startsWith('flag'))
    .map(flag => flag.replace(/^flag/, ''));
const rotations = Object.keys(style)
    .filter(className => className.startsWith('rotation'))
    .map(flag => flag.replace(/^rotation/, ''));

const flagSetting = new SelectSetting('flag', flags[0], [
    'off',
    ...flags,
]).addAlias('general.prideLogo', oldValue =>
    oldValue.toString().replace(/^[a-z]/, $0 => $0.toUpperCase())
);
const rotationSetting = new SelectSetting('rotation', rotations[0], rotations)
    .addAlias('general.prideLogoRotated', rotated => rotations[Number(rotated)])
    .disabledIf(flagSetting, '==', 'off');

// logo in navbar, logo on login page
const logoSelector = '.navbar.fixed-top .navbar-brand img, #logoimage';

/**
 * Removes all relevant classes from the logo.
 * @param logo - the logo to remove from
 * @returns void
 */
const cleanClasses = (
    logo = document.querySelector<HTMLImageElement>(logoSelector)
) => logo?.classList.remove(...Object.values(style));

/**
 * Adds or remove the relevant classes from the logo and sets the mask according to the icon.
 */
const onload = async () => {
    await ready();

    const logo = document.querySelector<HTMLImageElement>(logoSelector);
    cleanClasses(logo);

    if (flagSetting.value === 'off' || !logo) {
        logo?.style.removeProperty('mask');
        return;
    }

    const logoPath = new URL(logo.src).href;
    document.documentElement.style.setProperty(
        '--pride-logo-mask-image',
        `url(${logoPath})`
    );

    logo.classList.add(
        style.prideLogo,
        style[`flag${flagSetting.value}`],
        style[`rotation${rotationSetting.value}`]
    );
};

flagSetting.onInput(() => void onload());
rotationSetting.onInput(() => void onload());

export default Feature.register({
    settings: new Set([flagSetting, rotationSetting]),
    onload,
    onunload: cleanClasses,
});
