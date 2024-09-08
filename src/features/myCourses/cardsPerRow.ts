import './cardsPerRow.scss';
import Feature from '../../_lib/Feature';
import { SliderSetting } from '../../_lib/Settings/SliderSetting';

/**
 *
 */
const setAmount = () =>
    document
        .querySelector<HTMLDivElement>('.dashboard-card-deck')
        ?.style.setProperty('--boxes-per-row', amount.value.toString());

const amount = new SliderSetting('amount', 4, {
    min: 1,
    max: 10,
    step: 1,
    labels: 10,
})
    .addAlias('settings.myCourses.boxesPerRow')
    .onInput(setAmount);

/**
 *
 */
const onload = () => setAmount();

export default Feature.register({
    settings: new Set([amount]),
    onload,
});
