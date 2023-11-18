// This file defines the settings types in a short way.
// it also provides some utility types to work with the settings.

type ShortSettings = [
    'Allgemeine Einstellungen',
    ['general.updateNotification', 'boolean'],
    ['general.fullwidth', 'boolean'],
    ['general.externalLinks', 'boolean'],
    ['general.truncatedTexts', 'boolean'],
    ['general.bookmarkManager', 'boolean'],
    ['general.noDownload', 'boolean'],
    ['general.christmasCountdown', 'boolean'],

    'Dashboard',
    ['dashboard.~layoutPlaceholder', 'string'],

    'Meine Kurse',
    ['myCourses.boxesPerRow', 'number'],
    ['myCourses.navbarDropdown', 'boolean'],

    'Kurse',
    ['courses.grades', 'boolean'],
    ['courses.gradesNewTab', 'boolean'],
    ['courses.collapseAll', 'boolean'],
    ['courses.imgMaxWidth', 'boolean'],
    ['courses.imageZoom', 'boolean'],
];

// a list of all setting ids (including never)
type SettingIDList<S extends SettingsListParam[] = ShortSettings> = S extends [
    infer First extends S[0],
    ...infer Rest extends SettingsListParam[],
]
    ? [First extends string ? never : First[0], ...SettingIDList<Rest>]
    : [];
// a union of all setting ids (excluding never)
type SettingID = Exclude<SettingIDList[number], never>;

type SettingByIDList<
    ID extends SettingID,
    S extends SettingsListParam[] = ShortSettings,
> = S extends [infer First, ...infer Rest extends SettingsListParam[]]
    ? [
          First extends SettingDefinition<ID>
              ? SettingTypeMap<ID>[First[1]]
              : never,
          ...SettingByIDList<ID, Rest>,
      ]
    : [];
// get the interface of a setting by its ID
type SettingByID<ID extends SettingID> = Exclude<
    SettingByIDList<ID>[number],
    never
>;

// get the type of the value of a setting by its ID
type SettingTypeByID<ID extends SettingID> = SettingByID<ID>['default'];

// region Setting Types
interface BaseSetting<ID extends string> {
    id: ID;
    name: string;
    description: string;
    disabled?: (settings: Record<string, boolean | number | string>) => boolean;
    attributes?: Record<string, string | number>;
}

interface BooleanSetting<ID extends string> extends BaseSetting<ID> {
    type: typeof Boolean;
    default: boolean;
}

interface NumberSetting<ID extends string> extends BaseSetting<ID> {
    type: typeof Number;
    default: number;
}

interface StringSetting<ID extends string> extends BaseSetting<ID> {
    type: typeof String;
    default: string;
}
// endregion

// map each setting type to its interface
interface SettingTypeMap<ID extends string> {
    boolean: BooleanSetting<ID>;
    number: NumberSetting<ID>;
    string: StringSetting<ID>;
}

// get the final interface of a setting by its ID and type
type Setting<
    ID extends string,
    Type extends keyof SettingTypeMap<ID>,
> = SettingTypeMap<ID>[Type];

// The type used in the short settings representation to define a setting
type SettingDefinition<ID extends string = string> = [
    ID,
    keyof SettingTypeMap<ID>,
];
// short setting representation or name of a group
type SettingsListParam = SettingDefinition | string;

// convert the short settings representation to the final settings list
type SettingsList<S extends SettingsListParam[] = ShortSettings> = S extends [
    infer First extends SettingDefinition,
    ...infer Rest extends SettingsListParam[],
]
    ? [Setting<First[0], First[1]>, ...SettingsList<Rest>]
    : S extends [
            infer First extends string,
            ...infer Rest extends SettingsListParam[],
        ]
      ? [First, ...SettingsList<Rest>]
      : [];

export {
    // All the settings, represented as a list of interfaces
    SettingsList as Settings,
    // All setting IDs as a union type
    SettingID,
    // get the interface of a setting by its ID
    SettingByID,
    // get the type of the value of a setting by its ID
    SettingTypeByID,
};
