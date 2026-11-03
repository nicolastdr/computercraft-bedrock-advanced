import { system } from "@minecraft/server";
import { registerComputerBlocks } from "./computer/blocks.js";
import { registerLuaRuntime } from "./lua/runtime.js";

console.warn("[CCBA] ComputerCraft Bedrock Advanced carregado.");
registerComputerBlocks();
registerLuaRuntime();

system.runInterval(() => {
  // Reservado para tarefas agendadas dos computadores e periféricos.
}, 20);
