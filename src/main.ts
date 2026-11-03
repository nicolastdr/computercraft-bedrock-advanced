import { world, system } from "@minecraft/server";
import { registerComputerBlocks } from "./computer/blocks.js";
import { registerLuaRuntime } from "./lua/runtime.js";

const PREFIX = "[CCBA]";

world.afterEvents.worldLoad.subscribe(() => {
  console.warn(PREFIX + " ComputerCraft Bedrock Advanced iniciado.");
  registerComputerBlocks();
  registerLuaRuntime();
});

system.runInterval(() => {
  // Reservado para tarefas agendadas dos computadores e periféricos.
}, 20);
