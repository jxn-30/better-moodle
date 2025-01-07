import type { Speiseplan } from '../speiseplan';

type Parser = (url: string) => Promise<Speiseplan>;

export default Parser;
