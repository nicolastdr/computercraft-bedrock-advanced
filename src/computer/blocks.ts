import { system } from "@minecraft/server";

export function registerComputerBlocks(): void {
  // A definição visual e o registro de blocos customizados no Bedrock são
  // declarativos (Behavior/Resource Pack). Este ponto conecta eventos e lógica
  // quando o jogador interage com ccba:computer_block.
  system.run(() => {
    console.warn("[CCBA] Bloco ccba:computer_block: aguardando interação.");
  });
}
