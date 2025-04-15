import Feature from '@/Feature';
import { ready } from '@/DOM';

const reload = async () => {
    if (window.location.pathname.startsWith('/login/')) {
        await ready();
        document.querySelectorAll<HTMLParagraphElement>('p').forEach(p => {
            if (p.innerText.match(/_{5,}/u)) {
                p.replaceWith(<div className="login-divider" />);
            }
        });
    }
};

export default Feature.register({ // TODO: should this be a "feature"?
    settings: new Set([]),
    onload: reload,
    onunload: reload,
});
