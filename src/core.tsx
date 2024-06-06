import './style/global.scss';
import style from './style/global.module.scss';
import { ready } from './_lib/DOM';
import { Modal } from './_lib/Modal';

// TODO
const settingsBtnTitle = 'Settings';

console.log(style);

const settingsBtn = (
    <div>
        <a
            href="#"
            role="button"
            class="nav-link position-relative icon-no-margin"
            title={settingsBtnTitle}
            aria-label={settingsBtnTitle}
        >
            <i
                class="fa fa-gears fa-fw"
                role="img"
                title={settingsBtnTitle}
            ></i>
        </a>
    </div>
);

new Modal({ type: 'SAVE_CANCEL' });

ready(() =>
    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(settingsBtn)
);
