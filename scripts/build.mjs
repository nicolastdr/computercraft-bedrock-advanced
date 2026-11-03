import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { deflateSync } from "node:zlib";

const root = new URL("../", import.meta.url).pathname;
const stagePath = root + ".build/";
const distPath = root + "dist/";
await mkdir(stagePath + "behavior/scripts", { recursive: true });
await mkdir(stagePath + "behavior/blocks", { recursive: true });
await mkdir(stagePath + "resource/textures/blocks", { recursive: true });
await mkdir(distPath, { recursive: true });

await build({
  entryPoints: ["src/main.ts"],
  outfile: stagePath + "behavior/scripts/main.js",
  bundle: true, platform: "browser", format: "esm", target: ["es2020"],
  packages: "bundle", external: ["@minecraft/server", "@minecraft/server-ui"],
  sourcemap: false, legalComments: "none"
});

const bpUuid = "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c11";
const rpUuid = "8a4c2e10-7b6d-4f91-8c3a-2e5d7b9f0a21";
const bpManifest = {
  format_version: 2,
  header: { name: "ComputerCraft Bedrock Advanced", description: "Computador de blocos programável em Lua.", uuid: bpUuid, version: [0,2,0], min_engine_version: [1,26,60] },
  modules: [
    { type: "data", uuid: "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c12", version: [0,2,0] },
    { type: "script", language: "javascript", entry: "scripts/main.js", uuid: "5e0a7d4d-1f3d-4b2e-9a5c-1d6a2e8f0c13", version: [0,2,0] }
  ],
  dependencies: [
    { uuid: rpUuid, version: [0,2,0] },
    { module_name: "@minecraft/server", version: "2.11.0" },
    { module_name: "@minecraft/server-ui", version: "2.0.0" }
  ]
};
const rpManifest = {
  format_version: 2,
  header: { name: "ComputerCraft Bedrock Advanced — Recursos", description: "Texturas do computador industrial.", uuid: rpUuid, version: [0,2,0], min_engine_version: [1,26,60] },
  modules: [{ type: "resources", uuid: "8a4c2e10-7b6d-4f91-8c3a-2e5d7b9f0a22", version: [0,2,0] }]
};
await writeFile(stagePath + "behavior/manifest.json", JSON.stringify(bpManifest, null, 2));
await writeFile(stagePath + "resource/manifest.json", JSON.stringify(rpManifest, null, 2));

const block = {
  format_version: "1.26.0",
  "minecraft:block": {
    description: { identifier: "ccba:computer_block", menu_category: { category: "construction", group: "itemGroup.name redstone" } },
    components: {
      "minecraft:display_name": "Computador de Blocos",
      "minecraft:destructible_by_mining": { seconds_to_destroy: 3.5 },
      "minecraft:destructible_by_explosion": { explosion_resistance: 12 },
      "minecraft:collision_box": true,
      "minecraft:selection_box": true,
      "minecraft:material_instances": {
        "*": { texture: "ccba_computer_side", render_method: "opaque" },
        "north": { texture: "ccba_computer_front", render_method: "opaque" },
        "up": { texture: "ccba_computer_top", render_method: "opaque" }
      },
      "ccba:computer_interaction": {}
    }
  }
};
await writeFile(stagePath + "behavior/blocks/computer_block.json", JSON.stringify(block, null, 2));
await mkdir(stagePath + "behavior/recipes", { recursive: true });
const recipe = {
  format_version: "1.20.10",
  "minecraft:recipe_shaped": {
    description: { identifier: "ccba:computer_block_recipe" },
    tags: ["crafting_table"],
    pattern: ["DDD", "DBD", "DDD"],
    key: {
      D: { item: "minecraft:dirt" },
      B: { item: "minecraft:redstone_block" }
    },
    result: { item: "ccba:computer_block", count: 1 }
  }
};
await writeFile(stagePath + "behavior/recipes/computer_block.json", JSON.stringify(recipe, null, 2));
const terrain = { resource_pack_name: "ccba_resource", texture_name: "atlas.terrain", padding: 8, num_mip_levels: 4, texture_data: {
  ccba_computer_front: { textures: "textures/blocks/computer_front" },
  ccba_computer_side: { textures: "textures/blocks/computer_side" },
  ccba_computer_top: { textures: "textures/blocks/computer_top" }
}};
await writeFile(stagePath + "resource/textures/terrain_texture.json", JSON.stringify(terrain, null, 2));

function png16(pixels) {
  const crcTable = Array.from({length:256}, (_,n) => { let c=n; for(let k=0;k<8;k++) c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1); return c>>>0; });
  const crc = b => { let c=0xffffffff; for(const v of b) c=crcTable[(c^v)&255]^(c>>>8); return (c^0xffffffff)>>>0; };
  const chunk = (type,data) => { const t=Buffer.from(type); const len=Buffer.alloc(4); len.writeUInt32BE(data.length); const sum=Buffer.alloc(4); sum.writeUInt32BE(crc(Buffer.concat([t,data]))); return Buffer.concat([len,t,data,sum]); };
  const raw=[]; for(let y=0;y<16;y++){ raw.push(0); for(let x=0;x<16;x++) raw.push(...pixels[y][x]); }
  const ihdr=Buffer.alloc(13); ihdr.writeUInt32BE(16,0); ihdr.writeUInt32BE(16,4); ihdr[8]=8; ihdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",deflateSync(Buffer.from(raw))),chunk("IEND",Buffer.alloc(0))]);
}
const make=(base)=>Array.from({length:16},()=>Array.from({length:16},()=>base));
const front=make([38,40,45,255]);
for(let y=0;y<16;y++) for(let x=0;x<16;x++) {
  if(x===0||x===15||y===0||y===15) front[y][x]=[20,22,26,255];
  if(x===1||x===14||y===1||y===10) front[y][x]=[130,137,148,255];
  if((x===2||x===13)&&y>=2&&y<=9) front[y][x]=[224,174,42,255];
  if(x>=3&&x<=12&&y>=2&&y<=8) front[y][x]=[8,13,19,255];
  if(x>=3&&x<=12&&y===9) front[y][x]=[91,99,110,255];
  if(y===11&&(x>=2&&x<=13)) front[y][x]=[105,111,121,255];
  if(y>=12&&y<=14&&x>=2&&x<=13) front[y][x]=((x+y)%2===0)?[72,78,88,255]:[47,52,61,255];
  if(x===12&&y===10) front[y][x]=[76,214,74,255];
}
const side=make([45,48,54,255]);
for(let y=0;y<16;y++) for(let x=0;x<16;x++) {
 if(x===0||x===15||y===0||y===15) side[y][x]=[20,22,26,255];
 if(x===1||x===14||y===2||y===13) side[y][x]=[190,145,39,255];
 if(x>=4&&x<=11&&y>=4&&y<=10) side[y][x]=[84,91,101,255];
 if(x>=5&&x<=10&&y>=5&&y<=9&&y%2===1) side[y][x]=[19,22,27,255];
}
const top=make([38,41,47,255]);
for(let y=0;y<16;y++) for(let x=0;x<16;x++) {
 if(x===0||x===15||y===0||y===15) top[y][x]=[18,20,24,255];
 if(x===3||x===12||y===3||y===12) top[y][x]=[88,94,104,255];
 if(x>=5&&x<=10&&y>=5&&y<=10&&(x===5||x===10||y===5||y===10)) top[y][x]=[229,177,40,255];
}
await writeFile(stagePath + "resource/textures/blocks/computer_front.png", png16(front));
await writeFile(stagePath + "resource/textures/blocks/computer_side.png", png16(side));
await writeFile(stagePath + "resource/textures/blocks/computer_top.png", png16(top));

const zipPath = distPath + "ComputerCraft-Bedrock-Advanced.mcaddon";
execFileSync("zip", ["-qr", zipPath, "behavior", "resource"], { cwd: stagePath });
console.log("Addon compilado: " + zipPath);
