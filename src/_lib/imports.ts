import Feature from './Feature';
import { isFeatureGroup } from 'i18n';
import FeatureGroup, { FeatureGroupID } from './FeatureGroup';

const featureGroupImports = Object.fromEntries(
    Object.entries<ReturnType<(typeof FeatureGroup)['register']>>(
        import.meta.glob(import.meta.env.VITE_INCLUDE_FEATURE_GROUPS_GLOB, {
            import: 'default',
            eager: true,
        })
    ).map(([key, value]) => [key.replace(/\.tsx?$/, ''), value])
);

const featureImports = Object.fromEntries(
    Object.entries<ReturnType<(typeof Feature)['register']>>(
        import.meta.glob(import.meta.env.VITE_INCLUDE_FEATURES_GLOB, {
            import: 'default',
            eager: true,
        })
    ).map(([key, value]) => [key.replace(/\.tsx?$/, ''), value])
);

/**
 * inits a feature by instantiating the feature class and calling its init method
 * @param group - the group this feature belongs to
 * @param featureId - the id of this feature
 * @returns the instantiated feature
 */
const initFeature = (
    group: FeatureGroup<FeatureGroupID>,
    featureId: string
) => {
    const Feature =
        featureImports[
            `${import.meta.env.VITE_FEATURES_BASE}${group.id}/${featureId}`
        ];
    if (!Feature) return;
    const feature = new Feature(featureId, group);
    return feature;
};

const featureGroups = new Map<string, FeatureGroup<FeatureGroupID>>();

Object.entries(featureGroupImports).forEach(([id, FeatureGroup]) => {
    const groupId = id.split('/')[3];
    if (!isFeatureGroup(groupId)) return;
    const featureGroup = new FeatureGroup(groupId);
    featureGroup.loadSettings();
    featureGroup.load();
    featureGroup.loadFeatures(id => initFeature(featureGroup, id));
    featureGroups.set(groupId, featureGroup);
});

const onImportsDoneResolvers = new Set<
    PromiseWithResolvers<typeof featureGroups>['resolve']
>();

/**
 * Creates a promise, adds the resolver to the set and returns the promise
 * @returns a promise that will be resolved once all featuregroups are fully loaded
 */
const createImportDoneResolver = () => {
    const { promise, resolve } = Promise.withResolvers<typeof featureGroups>();
    onImportsDoneResolvers.add(resolve);
    return promise;
};

let importsAreDone = false;

/**
 * Wait for all featureGroups to be fully loaded
 * @returns a promise that resolves to the featureGroups map once all featureGroups are fully loaded
 */
const awaitImports = () =>
    importsAreDone ?
        Promise.resolve(featureGroups)
    :   createImportDoneResolver();

void Promise.all(
    featureGroups.values().map(group => group.FieldSet.awaitReady())
)
    .then(() => (importsAreDone = true))
    .then(() =>
        onImportsDoneResolvers.forEach(resolver => resolver(featureGroups))
    );

export default awaitImports;
