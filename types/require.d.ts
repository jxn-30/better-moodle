// Definitions for the require.js module loader.
// or at least the definitions required for Better-Moodle.

import BlockMyOverviewRepository from './require.js/block/myoverview/repository';
import BlockMyOverviewSelectors from './require.js/block/myoverview/selectors';
import CoreConfig from './require.js/core/config';
import CoreCustomInteractionEvents from './require.js/core/custom_interaction_events';
import CoreFiltersEvents from './require.js/core_filters/event';
import CoreLocalstorage from './require.js/core/localstorage';
import CoreModalEvents from './require.js/core/modal_events';
import CoreModalFactory from './require.js/core/modal_factory';
import CorePubsub from './require.js/core/pubsub';
import CoreStr from './require.js/core/str';
import CoreTemplates from './require.js/core/templates';
import CoreToast from './require.js/core/toast';
import InitEmojiAutoComplete from './require.js/core/emoji/auto_complete';
import InitEmojiPicker from './require.js/core/emoji/picker';
import JQueryStatic from '@types/jquery';
import ThemeBoostBootstrapTooltip from './require.js/theme_boost/bootstrap/tooltip';
import ThemeBoostDrawer from './require.js/theme_boost/drawer';
import ThemeBoostDrawers from './require.js/theme_boost/drawers';

interface ModuleMap {
    'block_myoverview/selectors': BlockMyOverviewSelectors;
    'block_myoverview/repository': BlockMyOverviewRepository;

    'core/config': CoreConfig;
    'core/custom_interaction_events': CoreCustomInteractionEvents;
    'core/emoji/auto_complete': InitEmojiAutoComplete;
    'core/emoji/picker': InitEmojiPicker;
    'core/localstorage': CoreLocalstorage;
    'core/modal_factory': CoreModalFactory;
    'core/modal_events': CoreModalEvents;
    'core/pubsub': CorePubsub;
    'core/str': CoreStr;
    'core/templates': CoreTemplates;
    'core/toast': CoreToast;

    'core_filters/events': CoreFiltersEvents;

    'jquery': JQueryStatic;

    'theme_boost/bootstrap/tooltip': ThemeBoostBootstrapTooltip;

    'theme_boost/drawer': ThemeBoostDrawer;
    'theme_boost/drawers': typeof ThemeBoostDrawers;
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
