import { Plugin as ESBuildPlugin } from 'https://deno.land/x/esbuild@v0.19.11/mod.js';
import pluginSetup from './plugin_setup.ts';

/**
 * The main plugin object.
 *
 * @returns The plugin
 */
export default function htmlPlugin(): ESBuildPlugin {
  return {
    name: 'esbuild-plugin-html',
    setup: (build) =>
      pluginSetup(
        build.initialOptions,
        build.onLoad,
      ),
  };
}
