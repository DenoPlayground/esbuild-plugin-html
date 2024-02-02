/// <reference lib="deno.ns" />
import * as esbuild from 'https://deno.land/x/esbuild@v0.19.12/mod.js';
import { green } from 'https://deno.land/std@0.211.0/fmt/colors.ts';
import { parseArgs } from 'https://deno.land/std@0.211.0/cli/parse_args.ts';
import htmlPlugin from "./src/index.ts";

const args = parseArgs<{
  watch: boolean | undefined,
  develope: boolean | undefined,
  logLevel: esbuild.LogLevel
}>(Deno.args);

const copyConfig : esbuild.BuildOptions = {
  allowOverwrite: true,
  logLevel: args.logLevel ?? 'info',
  color: true,
  outdir: './test/dist',
  loader: {
    '.html': 'copy'
  },
  entryPoints: [
    './test/src/test.html',
  ],
  plugins: [
    htmlPlugin()
  ]
}

console.log('Build process started.');

const timestampNow = Date.now();

if (args.watch) {
  esbuild.context(copyConfig).then((context) => context.watch());
} else {
  Promise.all([
    esbuild.build(copyConfig),
  ]).then(() => {
    esbuild.stop();
    console.log(green(`Build process finished in ${(Date.now() - timestampNow).toString()}ms.`));
  })
}
