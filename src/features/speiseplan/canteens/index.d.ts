export interface Canteen {
    key: string;
    title: string;
    closingHour: number;
    url: Record<string, string>;
    urlNextWeek?: Record<string, string>; // Optional (?)
    hasCO2?: boolean; // Optional (?)
}

type Canteens = Map<string, Canteen>;
export default Canteens;
