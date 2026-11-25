// Node ESM loader hook: compiles .jsx with Next's bundled SWC (automatic JSX runtime) so server
// components can be unit-tested with react-dom/server without a bundler.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let swc;
async function getSwc() {
  if (!swc) {
    swc = require("next/dist/build/swc");
    await swc.loadBindings();
  }
  return swc;
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".jsx")) {
    const source = await readFile(fileURLToPath(url), "utf8");
    const { transform } = await getSwc();
    const out = await transform(source, {
      filename: fileURLToPath(url),
      jsc: { parser: { syntax: "ecmascript", jsx: true }, transform: { react: { runtime: "automatic" } } },
      module: { type: "es6" },
    });
    return { format: "module", source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
