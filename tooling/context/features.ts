import { featureBase } from './subpaths';
import fs from 'node:fs/promises';
import path from 'node:path';
import { styleText } from 'node:util';
import { config, globalConfig } from './config';

const groupsInGlobalConfig = new Set(globalConfig.featureGroupOrder);
const defaultDisabled = new Set(globalConfig.defaultDisabled);
const nonDefaultIncluded = new Set(config.includeNonDefaultFeatures);

// Discover available featureGroups
const featuresOfGroups = new Map<string, Set<string>>();
const availableGroups = new Set<string>();
const featureGroupIterator = fs.glob(`${featureBase}/*/index.{ts,tsx}`); /* */
for await (const featurePath of featureGroupIterator) {
    const featureGroup = path.basename(path.dirname(featurePath));

    // Warn if any the detected featureGroup is not listed in globalConfig
    if (!groupsInGlobalConfig.has(featureGroup) && featureGroup !== 'general') {
        console.warn(
            styleText(
                ['bold', 'yellow'],
                `⚠️ FeatureGroup ${JSON.stringify(
                    featureGroup
                )} is not listed in featureGroupOrder. It will be appended to the end of settings!`
            )
        );
    }

    availableGroups.add(featureGroup);
    featuresOfGroups.set(featureGroup, new Set<string>());
}

// TODO: Warn if a featureGroup is in globalConfig but does not exist in fs

// Discover available features
const availableFeatures = new Set<string>();
const featureIterator = fs.glob(`${featureBase}/*/!(index).{ts,tsx}`); /* */
for await (const featurePath of featureIterator) {
    const featureGroup = path.basename(path.dirname(featurePath));
    const feature = path.basename(featurePath, path.extname(featurePath));

    // If the filename (without extension) contains a dot, it is an extra file, not a feature
    // e.g. type definitions will end on .d
    if (feature.includes('.')) continue;

    const id = `${featureGroup}.${feature}`;
    availableFeatures.add(id);
    featuresOfGroups.get(featureGroup)?.add(id);
}

// Small helpers
/**
 * Is it a feature or a featureGroup?
 * @param featureId - feature id
 * @returns wether it is a feature or a featureGroup
 */
const isFeature = (featureId: string) => featureId.includes('.');
/**
 * Get the group of a feature
 * @param featureId - feature id
 * @returns the group of this feature
 */
const groupOf = (featureId: string) => featureId.split('.', 1)[0];
/**
 * Can this feature not be enabled under any circumstances?
 * @param featureId - feature id
 * @returns wether this feature cannot be enabled
 */
const isLocked = (featureId: string) =>
    locked.has(featureId) || locked.has(groupOf(featureId));
/**
 * Is this feature disabled by default?
 * @param featureId - feature id
 * @returns wether this feature is disabled by default
 */
const isDefaultDisabled = (featureId: string) =>
    defaultDisabled.has(featureId) || defaultDisabled.has(groupOf(featureId));
/**
 * Is this non-default feature included?
 * @param featureId - feature id
 * @returns wether this non-default feature is included
 */
const isNonDefaultIncluded = (featureId: string) =>
    nonDefaultIncluded.has(featureId) ||
    nonDefaultIncluded.has(groupOf(featureId));

// These featureGroups and features cannot be enabled
const locked = new Set<string>();
Object.entries(globalConfig.enabledFrom).forEach(([version, features]) => {
    if (config.moodleVersion < parseInt(version)) {
        features.forEach(feature => locked.add(feature));
    }
});
Object.entries(globalConfig.disabledFrom).forEach(([version, features]) => {
    if (config.moodleVersion >= parseInt(version)) {
        features.forEach(feature => locked.add(feature));
    }
});

// Select enabled features
const candidates = new Set<string>();

// First simply include all specified features, then remove lockeds later
const includedByConfig =
    'includeFeatures' in config ? config.includeFeatures : [];
const excludedByConfig =
    'excludeFeatures' in config ? config.excludeFeatures : [];
if (includedByConfig.length) {
    // Only include the features listed in here
    includedByConfig.forEach(feature => {
        if (isFeature(feature)) candidates.add(feature);
        else {
            featuresOfGroups
                .get(groupOf(feature))
                ?.forEach(feat => candidates.add(feat));
        }
    });
} else {
    // First, add all features, remove excluded explicitely
    availableFeatures.forEach(feat => candidates.add(feat));
    // Also include all featureGroups that don't have any groups
    featuresOfGroups.forEach((features, group) => {
        if (features.size === 0) candidates.add(group);
    });

    excludedByConfig.forEach(feature => {
        if (isFeature(feature)) candidates.delete(feature);
        else {
            featuresOfGroups
                .get(groupOf(feature))
                ?.forEach(feat => candidates.delete(feat));
        }
    });
}

// Now exclude features, locked
// And apply defaultDisabled
candidates.forEach(feature => {
    if (isLocked(feature)) candidates.delete(feature);
    else if (isDefaultDisabled(feature) && !isNonDefaultIncluded(feature)) {
        candidates.delete(feature);
    }
});

// Export and cleanup set
export const enabledFeatures = new Set<string>();
export const enabledGroups = new Set<string>(['general']); // The general group base must always be included

candidates.forEach(feature => {
    if (isFeature(feature)) enabledFeatures.add(feature);
    else enabledGroups.add(feature);
});

featuresOfGroups.forEach((features, group) => {
    if (features.values().some(feature => candidates.has(feature))) {
        enabledGroups.add(group);
    }
});

// Sort the sets
/**
 * Sorts a set
 * @param unsortedSet - a set with possibly unsorted elements
 */
const sortSet = (unsortedSet: Set<string>) => {
    const sortedValues = unsortedSet.values().toArray().toSorted();
    unsortedSet.clear();
    sortedValues.forEach(value => unsortedSet.add(value));
};

sortSet(enabledFeatures);
sortSet(enabledGroups);

// Exported helper functions
/**
 * Is this feature or featureGroup enabled?
 * @param featureId - feature id
 * @returns wether this feature or featureGroup is enabled
 */
export const isEnabled = (featureId: string) =>
    isFeature(featureId) ?
        enabledFeatures.has(featureId)
    :   enabledGroups.has(featureId);

// Ordered featureGroups in the order how they will appear in settings
export const orderedFeatures: string[] = ['general']; // general is always the first group

groupsInGlobalConfig.forEach(group => {
    if (isEnabled(group)) orderedFeatures.push(group);
});
Object.freeze(orderedFeatures);
Object.seal(orderedFeatures);

// A markdown export of the features
export const markdown = enabledGroups
    .values()
    .map(
        group =>
            `* ${group}${enabledFeatures
                .values()
                .filter(feat => feat.startsWith(`${group}.`))
                .map(feat => `\n  * ${feat}`)
                .toArray()
                .join('')}`
    )
    .toArray()
    .join('\n');
