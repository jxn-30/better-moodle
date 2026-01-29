import { ready } from '#lib/DOM';

if (window.location.pathname.startsWith('/login/')) {
    void ready().then(() =>
        document.querySelectorAll<HTMLParagraphElement>('p').forEach(p => {
            if (/_{5,}/u.test(p.innerText)) {
                p.replaceWith(<div className="login-divider" />);
            }
        })
    );
}
