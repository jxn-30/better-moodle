import { ready } from '@/DOM';

if (window.location.pathname.startsWith('/login/')) {
    await ready();
    document.querySelectorAll<HTMLParagraphElement>('p').forEach(p => {
        if (/_{5,}/u.test(p.innerText)) {
            p.replaceWith(<div className="login-divider" />);
        }
    });
}
