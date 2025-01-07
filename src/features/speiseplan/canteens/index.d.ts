export interface Canteen {
    key: string;
    title: string;
    url: Record<string, string>;
    urlNextWeek: Record<string, string>;
}

type Canteens = Map<string, Canteen>;
export default Canteens;
