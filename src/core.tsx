import './style/global.module.scss';

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

console.log(settingsBtn);

document
    .querySelector('#usernavigation .usermenu-container')
    ?.before(settingsBtn);
