import { ready } from '#lib/DOM';

const HSNR_SVG_LOGO =
    'https://moodle.hsnr.de/pluginfile.php/1/theme_boost_union/logocompact/1/1782998357/hsnr-logo_bc_rgb.svg';

if (window.location.pathname.startsWith('/login/')) {
    void ready().then(() => {
        const logo = document.querySelector<HTMLImageElement>('#logoimage');
        if (logo) {
            logo.src = HSNR_SVG_LOGO;
        }
    });
}
