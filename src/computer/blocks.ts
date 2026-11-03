import { system } from "@minecraft/server";
import { openComputer } from "../ui/computer.js";

export function registerComputerBlocks(): void {
  system.beforeEvents.startup.subscribe((event) => {
    event.blockComponentRegistry.registerCustomComponent("ccba:computer_interaction", {
      onPlayerInteract: (interaction) => {
        const player = interaction.player;
        if (!player) return;
        system.run(() => openComputer(player, interaction.block));
      }
    });
  });
}
