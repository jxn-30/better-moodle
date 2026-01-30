import { requirePromise } from '#lib/require.js';
import type {
    ToastConfiguration,
    ToastMessage,
} from '#types/require.js/core/toast';

/**
 * Shows a toast message within moodle
 * @param message - the message that is to be shown
 * @param config - further configuration for the toast
 * @returns a void promise that resolves once the toast is shown
 */
const toast = (message: ToastMessage, config: ToastConfiguration) =>
    requirePromise(['core/toast'] as const).then(([{ add }]) =>
        add(message, config)
    );

export default toast;
