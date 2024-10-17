// Definitions for the require.js module loader.
// or at least the definitions required for Better-Moodle.

import BlockMyOverviewSelectors from './require.js/block/myoverview/selectors';
import CoreModalEvents from './require.js/core/modal_events';
import CoreModalFactory from './require.js/core/modal_factory';
import CoreStr from './require.js/core/str';
import CoreTemplates from './require.js/core/templates';
import CoreToast from './require.js/core/toast';

interface ModuleMap {
    'core/modal_factory': CoreModalFactory;
    'core/modal_events': CoreModalEvents;
    'core/str': CoreStr;
    'core/templates': CoreTemplates;
    'core/toast': CoreToast;

    'block_myoverview/selectors': BlockMyOverviewSelectors;
}

type Module = keyof ModuleMap;
type ModuleReturnType<M extends Module> = ModuleMap[M];

type ModulesReturnType<M extends Module[]> =
    M extends [infer Mod extends Module, ...infer Tail extends Module[]] ?
        [ModuleReturnType<Mod>, ...ModulesReturnType<Tail>]
    :   [];

type TypedRequire = <M extends Module[]>(
    modules: M,
    ready: (...args: ModulesReturnType<M>) => void
) => void;

export type PromisedRequire = <M extends Module[]>(
    modules: M
) => Promise<ModulesReturnType<M>>;

declare global {
    declare const requirejs: TypedRequire;
}
