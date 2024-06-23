import Feature from './Feature';
import FeatureGroup from './FeatureGroup';

// outsourcing this into an extra file has been necessary
// as vite otherwise puts the glob imports above the definition of FeatureGroup
// which throws a
// `ReferenceError: can't access lexical declaration 'FeatureGroup' before initialization`

console.log(
    import.meta.env.VITE_FEATURES_BASE,
    import.meta.env.VITE_INCLUDE_FEATURE_GROUPS_GLOB,
    import.meta.env.VITE_INCLUDE_FEATURES_GLOB
);

const featureGroupImports: Record<
    string,
    ReturnType<(typeof FeatureGroup)['register']>
> = import.meta.glob(import.meta.env.VITE_INCLUDE_FEATURE_GROUPS_GLOB, {
    import: 'default',
    eager: true,
});

const featureImports: Record<
    string,
    ReturnType<(typeof Feature)['register']>
> = import.meta.glob(import.meta.env.VITE_INCLUDE_FEATURES_GLOB, {
    import: 'default',
    eager: true,
});

/**
 * @param group
 * @param featureId
 */
const initFeature = (group: FeatureGroup, featureId: string) => {
    const Feature =
        featureImports[
            `${import.meta.env.VITE_FEATURES_BASE}${group.id}/${featureId}.ts`
        ];
    if (!Feature) return;
    const feature = new Feature(featureId, group);
    feature.init();
    return feature;
};

const featureGroups = new Map<string, FeatureGroup>();

for (const [id, FeatureGroup] of Object.entries(featureGroupImports)) {
    const groupId = id.split('/')[3];
    const featureGroup = new FeatureGroup(groupId);
    featureGroup.init();
    featureGroup.loadFeatures(id => initFeature(featureGroup, id));
    featureGroups.set(groupId, featureGroup);
}

export default featureGroups;
