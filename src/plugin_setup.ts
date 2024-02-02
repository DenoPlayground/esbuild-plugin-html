import {
  BuildOptions,
  OnLoadArgs,
  OnLoadOptions,
  OnLoadResult,
} from 'https://deno.land/x/esbuild@v0.19.11/mod.js';

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";
import { dirname } from "https://deno.land/std@0.214.0/path/mod.ts";

/**
 * This function registers the onLoad function and sets some initial options.
 *
 * @param initialOptions Initial options from ESBuild for the plugin to use
 * @param onLoadFunction The `onLoad` function for the plugin
 */
export default function pluginSetup(
  initialOptions: BuildOptions,
  onLoadFunction: (
    options: OnLoadOptions,
    callback: (
      args: OnLoadArgs,
    ) =>
      | OnLoadResult
      | null
      | undefined
      | Promise<OnLoadResult | null | undefined>,
  ) => void,
): void {
  onLoadFunction(
    { filter: /\.html$/ },
    async (args) => {
      const domParser = new DOMParser()
      const fileContent = Deno.readTextFileSync(args.path);
      const fileContentParsed = domParser.parseFromString(fileContent, 'text/html');
      
      for (const template of fileContentParsed?.getElementsByTagName('template') ?? []) {
        const sourcePath = dirname(args.path) + '\\' +template.getAttribute('src');
        
        if (!sourcePath) continue;

        let sourceFileContent = '';

        try {
          sourceFileContent = Deno.readTextFileSync(sourcePath)
        } catch(error) {
          if (error instanceof Deno.errors.NotFound) {
            continue;
          } else {
            throw new Error(error)
          }
        }

        const sourceFileContentParsed = domParser.parseFromString(sourceFileContent, 'text/html')

        if (sourceFileContentParsed) {
          template.insertBefore(sourceFileContentParsed, fileContentParsed)
          // fileContentParsed?.body.insertBefore(template, sourceFileContentParsed)
        }
        // template.remove()
      }

      return {
        contents: fileContentParsed?.documentElement?.outerHTML ?? fileContent,
        loader: 'copy',
      };
    },
  );
}
