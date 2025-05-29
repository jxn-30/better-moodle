import { NETWORK_CACHE_KEY, type NetworkCache } from '@/network';

const networkCache = GM_getValue<NetworkCache>(NETWORK_CACHE_KEY, {
    urls: {},
    processed: {},
});
Object.entries(networkCache.urls).forEach(([url, { expires }]) => {
    if (expires < Date.now()) delete networkCache.urls[url];
});
Object.entries(networkCache.processed).forEach(([url, { expires }]) => {
    if (expires < Date.now()) delete networkCache.processed[url];
});
GM_setValue(NETWORK_CACHE_KEY, networkCache);
