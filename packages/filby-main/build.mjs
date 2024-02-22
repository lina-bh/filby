import { build } from "esbuild";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

let dirname;
if (typeof globalThis.__dirname === "undefined") {
  dirname = path.dirname(fileURLToPath(import.meta.url));
} else {
  dirname = globalThis.__dirname;
}

try {
  await fs.rm(path.join(dirname, "./dist"), { recursive: true });
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

const config = {
  outdir: "dist",
  platform: "node",
  target: "node18",
  treeShaking: true,
  sourcemap: true,
  entryPoints: ["src/**/*.ts", "src/**/*.js"],
};

await build({
  ...config,
  format: "cjs",
  entryPoints: ["src/**/*.ts", "src/**/*.js"],
});
await build({
  ...config,
  format: "iife",
  entryPoints: ["src/renderer-api.ts"],
});
