export interface Dish {
    name: { text: string | HTMLBRElement; info?: string }[];
    location: string;
    allergenes: string[];
    additives: string[];
    types: string[];
    prices: number[];
    co2: { stars: number; emission: number } | false;
}

export interface DishType {
    name: string;
    icon?: URL;
    isExclusive?: true;
}

export interface Speiseplan {
    timestamp: number;
    dishes: Map<Date, Set<Dish>>;
    prices: string[];
    allergenes: Map<string, string>;
    additives: Map<string, string>;
    types: Map<string, DishType>;
}
