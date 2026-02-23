import { type Plugin } from 'vite';

/**
 * A small helper function to create a plugin but keep its name consistent within the framework
 * @param name - the basis plugin name
 * @param plugin - the plugin but without name
 * @returns the new plugin with a structured name
 */
export default function (name: string, plugin: Omit<Plugin, 'name'>): Plugin {
    return { ...plugin, name: `userscript:${name}` };
}
