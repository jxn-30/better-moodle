import { LL } from './i18n/i18n';
import { Modal } from '@/Modal';
import { htmlToElements, mdToHtml, PREFIX } from '@/helpers';

// TODO: Btn for hiding for this browser version
// TODO: Btn for hiding for this session

const storageKey = PREFIX('unsupported_browser-informed');

if (
    !new RegExp(__UA_REGEX__, __UA_REGEX_FLAGS__).test(navigator.userAgent) &&
    sessionStorage.getItem(storageKey) !== 'true'
) {
    new Modal({
        type: 'ALERT',
        large: false,
        title: LL.browserCheck.title(),
        body: (
            <div class="table-responsive">
                {htmlToElements(mdToHtml(LL.browserCheck.body()))}
                <table class="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th>{LL.browserCheck.browser()}</th>
                            <th>{LL.browserCheck.minVersion()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(__MIN_SUPPORTED_BROWSERS__).map(
                            ([browser, version]) => (
                                <tr class="text-capitalize">
                                    <td>{browser}</td>
                                    <td>{version}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        ),
        removeOnClose: true,
    })
        .show()
        .onShown(() => sessionStorage.setItem(storageKey, 'true'));
}
