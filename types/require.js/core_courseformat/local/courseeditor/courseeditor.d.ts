/* eslint-disable jsdoc/require-jsdoc */

import Exporter, { State } from './exporter';

export default class CourseEditor {
    state: State; // This comes from core/reactive inheritance but we don't want to type everything in full detail
    getInitialStatePromise(): Promise<void>; // This comes from core/reactive inheritance but we don't want to type everything into full detail
    getExporter(): Exporter;
}
