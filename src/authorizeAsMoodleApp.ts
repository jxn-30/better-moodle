import { ready } from '#lib/DOM.ts';

if (__MOODLE_APP_ENABLED__) {
    if (window.location.pathname.startsWith('/login/')) {
        void ready().then(() => {
            const loginForm =
                document.querySelector<HTMLFormElement>('form#login');
            loginForm?.addEventListener('submit', e => {
                e.preventDefault();

                const formData = new FormData(loginForm);
                const username = formData.get('username');
                const password = formData.get('password');
                if (
                    typeof username !== 'string' ||
                    typeof password !== 'string'
                ) {
                    console.error('Invalid login form fields.');
                    return;
                }

                void fetch('/login/token.php', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        service: 'moodle_mobile_app',
                        username,
                        password,
                    }),
                })
                    .then(resp => resp.json())
                    .then((data: unknown) =>
                        GM_setValue(
                            'wstoken',
                            isMoodleTokenResponse(data) ? data.token : undefined
                        )
                    )
                    .then(() => loginForm.submit());
            });
        });
    }
}

interface MoodleTokenResponse {
    token: string;
}

/**
 * Checks whether the provided data contains a valid Moodle token.
 * @param data - The unknown data to validate.
 * @returns True if the data contains a non-empty token string; otherwise, false.
 */
function isMoodleTokenResponse(data: unknown): data is MoodleTokenResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'token' in data &&
        typeof data.token === 'string' &&
        data.token.length > 0
    );
}
