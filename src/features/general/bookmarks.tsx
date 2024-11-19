import Feature from '@/Feature';
import { PREFIX } from '@/helpers';

const storageKey = 'bookmarks';
const oldStorageKey = PREFIX(storageKey);

console.log(storageKey, oldStorageKey);

export default Feature.register({});
