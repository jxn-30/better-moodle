import * as constants from './constants.ts';
import { config } from './config.ts';
import type { MoodleVersion } from '#_configs/_config.d.ts';

const supportedVersions = new Set<MoodleVersion>([
    400, 401, 402, 403, 404, 405, 500, 501, 502,
]);

type ComparisonOperator = 'LT' | 'LTE' | 'GT' | 'GTE' | 'EQ';
type Comparison = `${ComparisonOperator}${MoodleVersion}`;
export type Comparisons = Record<Comparison, boolean>;

const comparisons = new Map<Comparison, boolean>();
supportedVersions.forEach(version => {
    comparisons.set(`LT${version}`, config.moodleVersion < version);
    comparisons.set(`LTE${version}`, config.moodleVersion <= version);
    comparisons.set(`GT${version}`, config.moodleVersion > version);
    comparisons.set(`GTE${version}`, config.moodleVersion >= version);
    comparisons.set(`EQ${version}`, config.moodleVersion === version);
});

const comparisonsObject = Object.fromEntries(
    comparisons.entries()
) as Comparisons;

constants.setConstant('__MOODLE__', comparisonsObject);
