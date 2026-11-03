import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const stagePath = new URL("../.build/", import.meta.url).pathname;
const distPath = new URL("../dist/", import.meta.url).pathname;
await mkdir(stagePath + "/behavior/scripts", { recursive: true });
await mkdir(stagePath + "/resource", { recursive: true });
await mkdir(distPath, { recursive: true });

await build({
  entryPoints: ["src/main.ts"],
  outfile: stagePath + "/behavior/scripts/main.js",
  bundle: true,
  platform: "browser",
  format: "esm",
  target: ["es2020"],
  packages: "bundle",
  external: ["@minecraft/server"],
  sourcemap: false,
  legalComments: "none"
});

const bpManifest = {
  format_version: 2,
  header: {
    name: "ComputerCraft Bedrock Advanced — Behavior",
    description: "Computadores Lua, periféricos e automação.",
    uuid: "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c11",
    version: [0, 1, 0],
    min_engine_version: [1, 26, 60]
  },
  modules: [
    { type: "data", uuid: "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c12", version: [0, 1, 0] },
    { type: "script", language: "javascript", entry: "scripts/main.js", uuid: "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c13", version: [0, 1, 0] }
  ],
  dependencies: [{ module_name: "@minecraft/server", version: "2.11.0" }]
};

const rpManifest = {
  format_version: 2,
  header: {
    name: "ComputerCraft Bedrock Advanced — Resource",
    description: "Recursos visuais do ComputerCraft Bedrock Advanced.",
    uuid: "8a4c2e10-7b6d-4f91-8c3a-2e5d7b9f0a21",
    version: [0, 1, 0],
    min_engine_version: [1, 26, 60]
  },
  modules: [{ type: "resources", uuid: "8a4c2e10-7b6d-4f91-8c3a-2e5d7b9f0a22", version: [0, 1, 0] }]
};

await writeFile(stagePath + "/behavior/manifest.json", JSON.stringify(bpManifest, null, 2));
await writeFile(stagePath + "/resource/manifest.json", JSON.stringify(rpManifest, null, 2));

const zipPath = distPath + "/ComputerCraft-Bedrock-Advanced.mcaddon";
execFileSync("zip", ["-qr", zipPath, "behavior", "resource"], { cwd: stagePath });
console.log("Pacote inicial criado em " + zipPath);
