import { type Plugin } from 'vite';

/**
 * @param name
 * @param plugin
 */
export default function (name: string, plugin: Omit<Plugin, 'name'>): Plugin {
    return { ...plugin, name: `userscript:${name}` };
}
