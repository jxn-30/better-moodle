import { getNetworkCache, setNetworkCache } from '@/network';

const networkCache = getNetworkCache();
Object.entries(networkCache.urls).forEach(([url, { expires }]) => {
    if (expires < Date.now()) delete networkCache.urls[url];
});
Object.entries(networkCache.processed).forEach(([url, { expires }]) => {
    if (expires < Date.now()) delete networkCache.processed[url];
});
setNetworkCache(networkCache);
