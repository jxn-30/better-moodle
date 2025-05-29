import { ready } from '@/DOM';

if (window.location.pathname.startsWith('/login/')) {
    await ready();
    document.querySelectorAll<HTMLParagraphElement>('p').forEach(p => {
        if (/_{5,}/u.exec(p.innerText)) {
            p.replaceWith(<div className="login-divider" />);
        }
    });
}
