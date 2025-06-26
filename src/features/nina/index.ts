import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { getSeverityEmoji } from './util/enums';
import { SliderSetting } from '@/Settings/SliderSetting';
import type { Warnings } from './types';
import { cachedRequest, type NetworkResponseType } from '@/network';
import { FIVE_MINUTES, FOUR_MINUTES } from '@/times';

const API_BASE = 'https://nina.api.proxy.bund.dev/api31';

// The amtliche Regionalschlüssel has been extracted from https://www.xrepository.de/api/xrepository/urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs_2021-07-31/download/Regionalschl_ssel_2021-07-31.json
const ARS = __UNI__ === 'cau' ? '010020000000' : '091630000000'; // '010030000000'; // TODO: Always use Lübeck as fallback. The other key is only for testing purposes

/**
 * Fetches all warnings for the set location
 * @returns all active warnings
 */
const getWarnings = () =>
    cachedRequest<'json', NetworkResponseType<'json'>, Warnings>(
        `${API_BASE}/dashboard/${ARS}.json`,
        FIVE_MINUTES,
        'json'
    );
/**
 * Fetches details of a specific warning
 * @param warningId - the warning id
 * @returns warning details
 */
const getWarning = (warningId: string) =>
    cachedRequest(
        `${API_BASE}/warnings/${warningId}.json`,
        FOUR_MINUTES,
        'json'
    );

void getWarnings().then(({ value: warnings }) => {
    console.log(warnings);
    warnings.forEach(warning =>
        console.log(getSeverityEmoji(warning.payload.data.severity))
    );
});

console.log(getWarning);

const civilWarningsSetting = new SliderSetting('civilWarnings', 2, {
    min: 0,
    max: 3,
    step: 1,
    labels: ['off', 'extreme', 'severe', 'moderate'],
}).addAlias('nina.civilProtectionWarnings');
const weatherWarningsSetting = new SliderSetting('weatherWarnings', 2, {
    min: 0,
    max: 3,
    step: 1,
    labels: ['off', 'extreme', 'severe', 'moderate'],
}).addAlias('nina.weatherWarnings');
const floodWarningsSetting = new SliderSetting('floodWarnings', 0, {
    min: 0,
    max: 1,
    step: 1,
    labels: ['off', 'all'],
}).addAlias('nina.floodWarnings', old => Number(old));

const inAppNotifications = new BooleanSetting('inAppNotifications', true);
const desktopNotifications = new BooleanSetting(
    'desktopNotifications',
    false
).addAlias('nina.notification');

const notifyUpdates = new BooleanSetting('notifyUpdates', false);
const notifyClearSignal = new BooleanSetting('notifyClearSignal', true);

export default FeatureGroup.register({
    settings: new Set([
        civilWarningsSetting,
        weatherWarningsSetting,
        floodWarningsSetting,
        inAppNotifications,
        desktopNotifications,
        notifyUpdates,
        notifyClearSignal,
    ]),
});
