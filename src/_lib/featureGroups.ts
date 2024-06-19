import FeatureGroup from './FeatureGroup';

// outsourcing this into an extra file has been necessary
// as vite otherwise puts the glob imports above the definition of FeatureGroup
// which throws a
// `ReferenceError: can't access lexical declaration 'FeatureGroup' before initialization`

const featureGroupImports: Record<
    string,
    ReturnType<(typeof FeatureGroup)['register']>
> = import.meta.glob(import.meta.env.VITE_INCLUDE_FEATURES_GLOB, {
    import: 'default',
    eager: true,
});

const featureGroups = new Map<string, FeatureGroup>();

for (const [id, FeatureGroup] of Object.entries(featureGroupImports)) {
    const groupId = id.split('/')[3];
    const featureGroup = new FeatureGroup(groupId);
    featureGroup.init();

    // this will be overridden, but we want to ensure that general is always the first group
    if (!featureGroups.has('general')) {
        featureGroups.set('general', new FeatureGroup('general'));
    }

    featureGroups.set(groupId, featureGroup);
}

export default featureGroups;
