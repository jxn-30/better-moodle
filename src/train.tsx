import { ready } from '@/DOM';
import style from '!/train.module.scss';

/**
 *
 */
const Roof = () => <div className={style.roof}></div>;
/**
 *
 */
const WindowBar = () => <div className={style.windowBar}></div>;
/**
 *
 */
const Wheel = () => <div className={style.wheel}></div>;
/**
 *
 */
const WheelBar = () => (
    <div className={style.wheelBar}>
        <Wheel />
        <Wheel />
    </div>
);
/**
 *
 */
const Coach = () => (
    <div className={style.coach}>
        <WindowBar />
        <Roof />
        <WheelBar />
    </div>
);
/**
 *
 */
const Train = () => (
    <div className={style.train}>
        {...Array(5)
            .fill(0)
            .map(() => <Coach />)}
    </div>
);

void ready().then(() =>
    document
        .querySelector('[data-region="header-actions-container"]')
        ?.append(<Train />)
);
