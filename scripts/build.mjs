import { build } from "esbuild";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const dist = new URL("../dist/", import.meta.url);
const stage = new URL("../.build/", import.meta.url);
await mkdir(new URL("behavior/scripts/", stage), { recursive: true });
await mkdir(new URL("resource/textures/blocks/", stage), { recursive: true });
await mkdir(dist, { recursive: true });

await build({
  entryPoints: ["src/main.ts"],
  outfile: new URL("behavior/scripts/main.js", stage).pathname,
  bundle: true,
  platform: "browser",
  format: "esm",
  target: ["es2020"],
  packages: "bundle",
  sourcemap: false,
  legalComments: "none"
});

const bpManifest = {
  format_version: 2,
  header: {
    name: "ComputerCraft Bedrock Advanced — Behavior",
    description: "Computadores Lua, periféricos e automação.",
    uuid: randomUUID(),
    version: [0, 1, 0],
    min_engine_version: [1, 26, 60]
  },
  modules: [
    { type: "data", uuid: randomUUID(), version: [0, 1, 0] },
    { type: "script", language: "javascript", entry: "scripts/main.js", uuid: randomUUID(), version: [0, 1, 0] }
  ],
  dependencies: [
    { module_name: "@minecraft/server", version: "2.11.0" }
  ]
};

const rpManifest = {
  format_version: 2,
  header: {
    name: "ComputerCraft Bedrock Advanced — Resource",
    description: "Recursos visuais do ComputerCraft Bedrock Advanced.",
    uuid: randomUUID(),
    version: [0, 1, 0],
    min_engine_version: [1, 26, 60]
  },
  modules: [{ type: "resources", uuid: randomUUID(), version: [0, 1, 0] }]
};

await writeFile(new URL("behavior/manifest.json", stage), JSON.stringify(bpManifest, null, 2));
await writeFile(new URL("resource/manifest.json", stage), JSON.stringify(rpManifest, null, 2));
await writeFile(new URL("behavior/blocks.json", stage), JSON.stringify({ format_version: "1.21.0", "minecraft:block": [] }, null, 2));
await writeFile(new URL("resource/terrain_texture.json", stage), JSON.stringify({
  resource_pack_name: "ccba_resources",
  texture_name: "atlas.terrain",
  padding: 8,
  num_mip_levels: 4,
  texture_data: {}
}, null, 2));

const mcmeta = { format_version: 2, "minecraft:pack": { description: "ComputerCraft Bedrock Advanced", pack_icon: "pack_icon.png" } };
await writeFile(new URL("behavior/pack_icon.png.mcmeta", stage), JSON.stringify(mcmeta));
await writeFile(new URL("resource/pack_icon.png.mcmeta", stage), JSON.stringify(mcmeta));

const zipPath = new URL("../dist/ComputerCraft-Bedrock-Advanced.mcaddon", import.meta.url).pathname;
try {
  execFileSync("zip", ["-qr", zipPath, "behavior", "resource"], { cwd: new URL("../.build/", import.meta.url).pathname });
} catch {
  // GitHub-hosted Ubuntu and most local Linux environments provide zip.
  throw new Error("Não foi possível criar o .mcaddon: o utilitário zip é necessário.");
}
console.log("Addon criado em dist/ComputerCraft-Bedrock-Advanced.mcaddon");
