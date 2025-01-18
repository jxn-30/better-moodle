import FeatureGroup from '@/FeatureGroup';
import Marquee from '@/Marquee';
import marqueeStyle from '../../style/marquee.module.scss';
import { ready } from '@/DOM';

const marquee = new Marquee('#usernavigation', 'prepend');

void ready().then(() => {
    const userNav = document.getElementById('usernavigation');

    marquee.setMaxWidthFunction(
        () =>
            parseFloat(getComputedStyle(userNav).marginLeft) +
            (document
                .querySelector(`.${marqueeStyle.marqueeMinWidthPlaceholder}`)
                ?.getBoundingClientRect().width ?? 0)
    );
    marquee.observe(document.querySelector('.primary-navigation'));
    marquee.observe(userNav.parentElement);
});

export default FeatureGroup.register({
    features: new Set(['clock']),
});
export { marquee };
