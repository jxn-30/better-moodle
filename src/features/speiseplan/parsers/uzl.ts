import { getDocument } from '@/network';
import type Parser from './index';

/**
 * Parses a StudentenwerkSH canteen menu
 * @param url - the url parse from
 * @returns the speiseplan as a promise
 */
const parse: Parser = (url: string) =>
    getDocument(url).then(doc => {
        console.log(doc.documentElement);
        return {
            dishes: {},
            prices: [],
            allergenes: {},
            additives: {},
            types: {},
        };
    });

export default parse;
