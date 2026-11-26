import type { Speiseplan } from '../speiseplan';

type Parser = (url: string, lang: 'de' | 'en-gb') => Promise<Speiseplan>;

export default Parser;
