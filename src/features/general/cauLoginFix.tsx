import Feature from '@/Feature';
import { ready } from '@/DOM';

/**
 * Reloads the CAU login divider fix.
 */
const reload = async () => {
    if (window.location.pathname.startsWith('/login/')) {
        await ready();
        document.querySelectorAll<HTMLParagraphElement>('p').forEach(p => {
            if (/_{5,}/u.exec(p.innerText)) {
                p.replaceWith(<div className="login-divider" />);
            }
        });
    }
};

export default Feature.register({
    // TODO: should this be a "feature"?
    settings: new Set([]),
    onload: reload,
    onunload: reload,
});
