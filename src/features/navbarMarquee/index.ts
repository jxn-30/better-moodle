import { breakpoints } from '@/styleVars';
import FeatureGroup from '@/FeatureGroup';
import Marquee from '@/Marquee';
import marqueeStyle from '!/marquee.module.scss';
import { ready } from '@/DOM';

const marquee = new Marquee('#usernavigation', 'prepend');

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
    features: new Set(['clock', 'christmasCountdown']),
});
export { marquee };
