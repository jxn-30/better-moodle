export interface Dish {
    name: { text: string | HTMLBRElement; info?: string }[];
    location: string;
    allergenes: string[];
    additives: string[];
    types: string[];
    prices: string[];
    co2:
        | {
              stars: number;
              emission: number;
          }
        | false;
}

export interface Speiseplan {
    dishes: Map<Date, Set<Dish>>;
    prices: string[];
    allergenes: Map<string, string>;
    additives: Map<string, string>;
    types: Map<string, { name: string; icon: string }>;
}
