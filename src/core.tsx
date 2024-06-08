import './style/global.scss';
import style from './style/global.module.scss';
import { ready } from './_lib/DOM';
import { Modal } from './_lib/Modal';

// TODO
const settingsBtnTitle = 'Settings';

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

new Modal({
    type: 'SAVE_CANCEL',
    title: <p>Hello World!</p>,
    body: (
        <div>
            <pre>{JSON.stringify(style, null, 4)}</pre>
        </div>
    ),
})
    .onShown(() => console.log('Modal shown!'))
    .show();

ready(() =>
    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(settingsBtn)
);
