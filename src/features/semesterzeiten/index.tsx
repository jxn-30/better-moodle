import Block from '@/Block';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import { dateToString } from '@/localeString';
import FeatureGroup from '@/FeatureGroup';
import { isDashboard } from '@/helpers';
import { request } from '@/network';
import style from './style.module.scss';
import { getLoadingSpinner, ready } from '@/DOM';

const blockSetting = new BooleanSetting('block', false);

const block = new Block('semesterzeiten', true).setTitle('Schemeschdertaims');

let semesterzeiten;
/**
 *
 */
const getSemesterzeiten = () =>
    semesterzeiten ?
        Promise.resolve(semesterzeiten)
    :   request(`https://ics.better-moodle.dev/semesterzeiten/${__UNI__}`).then(
            res => res.json()
        );

const todaySpan = (
    <span class={style.todaySpan}>{dateToString()}</span>
) as HTMLSpanElement;
const toggleTableBtn = (
    <button class="mr-2 btn btn-link btn-sm p-0">
        <i class="icon fa fa-info-circle mr-0"></i>
    </button>
) as HTMLButtonElement;
const progressBar = (
    <div class="progress w-100 position-relative"></div>
) as HTMLDivElement;

/**
 * @param semester
 */
const loadContent = (semester = 0) => {
    let contentLoaded = false;
    // TODO: Do not create a new loadingSpinner but reuse the old one?
    void getLoadingSpinner().then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            block.setContent(spinner, false);
        }
    });

    void getSemesterzeiten().then(times => {
        contentLoaded = true;
        block.setContent(
            <>
                {semester === 0 ?
                    <div class="position-relative">{todaySpan}</div>
                :   <></>}
                <div class="d-flex align-items-center">
                    {toggleTableBtn}
                    {progressBar}
                </div>
                <div class="table-responsive">
                    <pre>{JSON.stringify(times)}</pre>
                </div>
            </>,
            false
        );
    });
};

/**
 *
 */
const onload = async () => {
    if (isDashboard && blockSetting.value) {
        await ready();
        const region = document.getElementById('block-region-content');
        if (!region) return;
        if (!block.rendered) await block.create(region, 'prepend');
        else block.put(region, 'prepend');
        void loadContent();
    } else {
        block?.remove();
    }
};

blockSetting.onInput(() => void onload());

/**
 *
 */
const onunload = () => {
    block?.remove();
};

export default FeatureGroup.register({
    settings: new Set([blockSetting]),
    onload,
    onunload,
});
