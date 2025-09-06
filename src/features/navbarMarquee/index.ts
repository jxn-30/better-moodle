import { breakpoints } from '@/styleVars';
import FeatureGroup from '@/FeatureGroup';
import Marquee from '@/Marquee';
import marqueeStyle from '!/marquee.module.scss';
import { ready } from '@/DOM';
import { SliderSetting } from '@/Settings/SliderSetting';

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
