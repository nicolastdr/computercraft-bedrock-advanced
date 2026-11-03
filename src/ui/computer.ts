import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import type { Player, Block } from "@minecraft/server";
import { executeLua } from "../lua/runtime.js";

type SavedProgram = { [name: string]: string };
const PROPERTY = "ccba:computer_programs";

function computerId(block: Block): string {
  const p = block.location;
  return `${block.dimension.id}:${p.x},${p.y},${p.z}`;
}
type ComputerStorage = { [computerId: string]: SavedProgram };
function loadPrograms(_player: Player, id: string): SavedProgram {
  try {
    const raw = world.getDynamicProperty(PROPERTY);
    if (typeof raw === "string") {
      const all = JSON.parse(raw) as ComputerStorage;
      return all[id] ?? {};
    }
  } catch (error) {
    console.warn("[CCBA] Falha ao ler programas: " + String(error));
  }
  return {};
}
function savePrograms(player: Player, id: string, programs: SavedProgram): void {
  let all: ComputerStorage = {};
  try {
    const raw = world.getDynamicProperty(PROPERTY);
    if (typeof raw === "string") all = JSON.parse(raw) as ComputerStorage;
  } catch { all = {}; }
  all[id] = programs;
  const serialized = JSON.stringify(all);
  if (serialized.length > 30000) {
    player.sendMessage("§cMemória de programas cheia. Apague arquivos antigos.");
    return;
  }
  world.setDynamicProperty(PROPERTY, serialized);
}

export function openComputer(player: Player, block: Block): void {
  const id = computerId(block);
  const programs = loadPrograms(player, id);
  const form = new ActionFormData().title("§l§0Computador de Blocos")
    .body(`§7ID: §f${id}\n§7Arquivos salvos: §f${Object.keys(programs).length}\n\n§fSelecione uma operação.`)
    .button("§a▶ Executar programa").button("§b✎ Editar / criar programa")
    .button("§e▤ Arquivos salvos").button("§cDesligar");
  form.show(player).then(response => {
    if (response.canceled) return;
    if (response.selection === 0) void chooseProgram(player, id);
    if (response.selection === 1) void editProgram(player, id);
    if (response.selection === 2) void listPrograms(player, id);
  }).catch(error => player.sendMessage("§cErro na interface: " + String(error)));
}
async function editProgram(player: Player, id: string): Promise<void> {
  const programs = loadPrograms(player, id);
  const response = await new ModalFormData().title("Editor Lua")
    .textField("Nome do arquivo", "startup.lua", { defaultValue: "startup.lua" })
    .textField("Código Lua", 'print("Olá, mundo!")', { defaultValue: programs["startup.lua"] ?? '-- Programa Lua\nprint("Olá, mundo!")' })
    .show(player);
  if (response.canceled || !response.formValues) return;
  const name = String(response.formValues[0] ?? "startup.lua").trim();
  const source = String(response.formValues[1] ?? "");
  if (!/^[a-zA-Z0-9_./-]+\.lua$/.test(name) || name.includes("..")) {
    player.sendMessage("§cNome inválido. Use um nome terminado em .lua."); return;
  }
  if (source.length > 12000) { player.sendMessage("§cLimite: 12.000 caracteres."); return; }
  programs[name] = source;
  savePrograms(player, id, programs);
  player.sendMessage(`§aArquivo ${name} salvo.`);
}
async function chooseProgram(player: Player, id: string): Promise<void> {
  const programs = loadPrograms(player, id);
  const names = Object.keys(programs);
  if (!names.length) { player.sendMessage("§eNenhum programa salvo. Crie um arquivo primeiro."); return; }
  const form = new ActionFormData().title("Executar Lua").body("Escolha o arquivo:");
  for (const name of names) form.button(name);
  const response = await form.show(player);
  if (response.canceled || response.selection === undefined) return;
  const name = names[response.selection];
  const result = executeLua(programs[name] ?? "");
  player.sendMessage(`§8[Lua] §7${name}`);
  for (const line of result.output.slice(0, 20)) player.sendMessage("§f" + line.slice(0, 240));
  if (!result.ok) player.sendMessage("§cErro Lua: " + (result.error ?? "erro desconhecido").slice(0, 240));
  else player.sendMessage("§aPrograma finalizado.");
}
async function listPrograms(player: Player, id: string): Promise<void> {
  const programs = loadPrograms(player, id);
  const names = Object.keys(programs);
  if (!names.length) { player.sendMessage("§eNenhum arquivo Lua salvo."); return; }
  player.sendMessage("§bArquivos Lua:");
  for (const name of names) player.sendMessage(`§7- §f${name} §8(${programs[name].length} caracteres)`);
}
