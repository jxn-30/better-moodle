import { BaseTranslation } from 'typesafe-i18n';

export interface FeatureGroupTranslation extends BaseTranslation {
    name: string;
    description?: string;
    settings?: Record<string, SettingTranslation>;
    features?: Record<string, FeatureTranslation>;
    [key: string]: BaseTranslation;
}

export interface FeatureTranslation extends BaseTranslation {
    settings?: Record<string, SettingTranslation>;
    [key: string]: BaseTranslation;
}

export interface SettingTranslation extends BaseTranslation {
    name: string;
    description: string;
    options?: Record<string, string>;
    labels?: Record<string | number, string>;
}
