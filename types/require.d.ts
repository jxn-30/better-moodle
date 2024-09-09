// Definitions for the require.js module loader.
// or at least the definitions required for Better-Moodle.

import CoreModalEvents from './require.js/core/modal_events';
import CoreModalFactory from './require.js/core/modal_factory';
import CoreToast from './require.js/core/toast';

interface ModuleMap {
    'core/modal_factory': CoreModalFactory;
    'core/modal_events': CoreModalEvents;
    'core/toast': CoreToast;
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

declare global {
    declare const requirejs: TypedRequire;
}
