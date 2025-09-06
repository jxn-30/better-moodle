export interface Canteen {
    key: string;
    title: string;
    closingHour: number;
    url: Record<string, string>;
    urlNextWeek: Record<string, string>;
}

type Canteens = Map<string, Canteen>;
export default Canteens;
