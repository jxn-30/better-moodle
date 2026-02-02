import { breakpoints } from '#lib/styleVars';
import FeatureGroup from '#lib/FeatureGroup';
import Marquee from '#lib/Marquee';
import marqueeStyle from '#style/marquee.module.scss';
import { ready } from '#lib/DOM';
import { SliderSetting } from '#lib/Settings/SliderSetting';

const marquee = new Marquee('#usernavigation', 'prepend');

const speed = new SliderSetting('speed', 5, {
    min: 0,
    max: 10,
    step: 1,
    labels: 3,
}).onInput(() => marquee.setSpeed(speed.value));

void ready().then(() => {
    const userNav = document.getElementById('usernavigation');

    if (!userNav) return;

    marquee.setMaxWidthFunction(() =>
        window.innerWidth < breakpoints.md ?
            window.innerWidth
        :   parseFloat(getComputedStyle(userNav).marginLeft) +
            (document
                .querySelector(`.${marqueeStyle.marqueeMinWidthPlaceholder}`)
                ?.getBoundingClientRect().width ?? 0)
    );
    marquee.observe(document.querySelector<HTMLElement>('.primary-navigation'));
    marquee.observe(userNav.parentElement);
});

export default FeatureGroup.register({
    settings: new Set([speed]),
    features: new Set(['eventAdvertisements', 'clock', 'christmasCountdown']),
});
export { marquee };
