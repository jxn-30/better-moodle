import './style/global.scss';
import { ready } from './_lib/DOM';
import { Modal } from './_lib/Modal';
import { GithubLink } from './_lib/Components';

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
    title: (
        <>
            <GithubLink path="" /> Better-Moodle:&nbsp;modals.settings.title
        </>
    ),
    body: <div>Hello world! ❤️</div>,
})
    .onShown(() => console.log('Modal shown!'))
    .setTrigger(settingsBtn);

ready(() =>
    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(settingsBtn)
);
