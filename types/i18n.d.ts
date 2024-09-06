import { BaseTranslation } from 'typesafe-i18n';

export interface FeatureGroupTranslation extends BaseTranslation {
    name: string;
    description?: string;
    settings?: Record<string, SettingTranslation>;
    features?: Record<string, FeatureTranslation>;
}

export interface FeatureTranslation extends BaseTranslation {
    settings?: Record<string, SettingTranslation>;
}

export interface SettingTranslation extends BaseTranslation {
    name: string;
    description: string;
}
