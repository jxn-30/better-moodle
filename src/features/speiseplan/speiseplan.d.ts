export interface Dish {
    name: string;
    location: string;
    allergens: string[];
    additives: string[];
    types: string[];
    prices: string[];
}

export interface Speiseplan {
    dishes: Record<Date, Dish[]>;
    prices: string[];
    allergenes: Record<string, string>;
    additives: Record<string, string>;
    types: Record<string, { name: string; icon: string }>;
}
