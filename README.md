# ComputerCraft Bedrock Advanced

Addon experimental para Minecraft Bedrock 1.26.60: computador cúbico com interface, armazenamento de programas e execução de Lua real através da VM Fengari.

## Marco 0.2 — núcleo inicial em desenvolvimento

Incluído no código:
- Bloco físico `ccba:computer_block` com geometria cúbica, colisão e seleção.
- Texturas pixel-art próprias para frente, laterais e topo.
- Nome localizado em português e inglês.
- Receita de bancada: 8 terras ao redor de 1 bloco de redstone.
- Loot table para o bloco dropar a si mesmo.
- Interação que abre menu com executar, criar/editar e listar arquivos.
- Arquivos guardados no armazenamento dinâmico do mundo, separados pelo ID/posição de cada computador.
- Interpretador Lua Fengari incorporado, com bibliotecas de sistema removidas.
- Pipeline para gerar Behavior Pack + Resource Pack e empacotar `.mcaddon`.

## Limitações atuais — não é a versão completa

- O campo de código usa o formulário nativo de texto do Bedrock; ainda não existe editor de código multilinha completo.
- A VM não possui ainda escalonador/limite de instruções. Não execute loops infinitos ou programas longos.
- Lua ainda não possui API de periféricos: `redstone`, `peripheral`, `turtle`, inventários e mundo ainda não estão ligados ao runtime.
- Turtles, monitores, modems, rede, servidor, sensores e controle de máquinas ainda não foram implementados.
- O addon ainda precisa ser validado dentro do Minecraft 1.26.60. A compilação no GitHub Actions precisa terminar com sucesso antes de distribuir o arquivo como instalável testado.

## Compilação

Node.js 20 ou superior:

```sh
npm install
npm run check
npm run build
```

O arquivo esperado é `dist/ComputerCraft-Bedrock-Advanced.mcaddon`.

No GitHub, abra **Actions → Build Addon** e baixe o artefato quando a execução estiver concluída com sucesso.

## Arquitetura

- `src/computer`: registro do componente de interação do computador.
- `src/ui`: menu, arquivos e execução.
- `src/lua`: VM Fengari.
- `scripts/build.mjs`: gera manifests, bloco, receita, loot table, atlas e texturas.

A Script API do Bedrock é JavaScript; Fengari executa código Lua dentro do pacote. As APIs do jogo serão expostas ao Lua por uma camada controlada de periféricos.
