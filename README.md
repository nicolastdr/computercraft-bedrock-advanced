# ComputerCraft Bedrock Advanced

Addon para Minecraft Bedrock 1.26.60 com computador cúbico programável em Lua, interface de terminal e base para periféricos.

## Estado desta versão (0.2.0)

Implementado no projeto:
- Bloco físico `ccba:computer_block`, com colisão, seleção e interação.
- Texturas pixel-art geradas durante a compilação para frente, laterais e topo.
- Interface de interação com ações para executar, editar/criar e listar arquivos.
- Execução de código Lua real por Fengari.
- Salvamento de arquivos Lua em propriedade persistente do jogador.
- Receita: 8 blocos de terra ao redor de 1 bloco de redstone.
- Pipeline GitHub Actions para empacotar Behavior Pack + Resource Pack em `.mcaddon`.

Ainda não implementado: periféricos Advanced Peripherals, Turtles, modems/rede, monitores, leitura/escrita de inventários, controle de máquinas e integração de sinais Redstone. A execução Lua ainda não tem um escalonador de instruções com limite de tempo; evite programas com loops infinitos.

## Instalação (quando o artefato da compilação estiver publicado)

1. Baixe `ComputerCraft-Bedrock-Advanced.mcaddon` na seção **Actions → Build Addon → Artifacts** do GitHub.
2. Abra o arquivo no Minecraft para importar os dois pacotes.
3. Crie um mundo de teste e ative o Behavior Pack e o Resource Pack.
4. Entre no mundo, fabrique o computador com 8 terras e 1 bloco de redstone no centro.
5. Coloque o bloco e interaja com ele. O menu permite editar um arquivo Lua e executá-lo.

Se o item não aparecer na receita, teste em um mundo novo e confira o Content Log do Minecraft.

## Desenvolvimento

Requer Node.js 20+.

```sh
npm install
npm run check
npm run build
```

O pacote é gerado em `dist/ComputerCraft-Bedrock-Advanced.mcaddon`.

## Arquitetura

- `src/computer`: componentes e lógica do computador.
- `src/ui`: interface e editor de arquivos.
- `src/lua`: VM Lua Fengari.
- `scripts/build.mjs`: gera manifests, JSON do bloco, texturas PNG e arquivo final.

A API oficial do Bedrock é JavaScript; o addon incorpora Fengari para executar Lua real. A camada de periféricos será conectada progressivamente às APIs do mundo, sem expor diretamente APIs arbitrárias do JavaScript aos programas Lua.
