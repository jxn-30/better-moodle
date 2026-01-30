import { LL } from '#i18n';
import { Modal } from '#lib/Modal';
import { requirePromise } from '#lib/require.js';
import { htmlToElements, mdToHtml, PREFIX } from '#lib/helpers';

if (!new RegExp(__UA_REGEX__, __UA_REGEX_FLAGS__).test(navigator.userAgent)) {
    void requirePromise(['core/config'] as const).then(([config]) => {
        const storageKey = PREFIX('unsupported_browser-informed');
        const stored = localStorage.getItem(storageKey);

        const uaString = `u!${navigator.userAgent}`;
        const sessionString = `s!${config.sesskey}`;

        if (stored === uaString || stored === sessionString) return;

        new Modal({
            type: 'SAVE_CANCEL',
            large: false,
            title: LL.browserCheck.title(),
            body: (
                <div className="table-responsive">
                    {htmlToElements(mdToHtml(LL.browserCheck.body()))}
                    <table className="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <th>{LL.browserCheck.browser()}</th>
                                <th>{LL.browserCheck.minVersion()}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(__MIN_SUPPORTED_BROWSERS__).map(
                                ([browser, version]) => (
                                    <tr className="text-capitalize">
                                        <td>{browser}</td>
                                        <td>{version}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            ),
            buttons: {
                cancel: LL.browserCheck.dismiss.version(),
                save: LL.browserCheck.dismiss.session(),
            },
            removeOnClose: true,
        })
            .show()
            .onCancel(() => localStorage.setItem(storageKey, uaString))
            .onSave(() => localStorage.setItem(storageKey, sessionString));
    });
}
