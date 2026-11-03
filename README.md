# ComputerCraft Bedrock Advanced

Addon para Minecraft Bedrock com computadores programáveis em Lua, periféricos e automação inspirados em ComputerCraft e Advanced Peripherals.

## Estado do projeto

Este repositório contém a estrutura inicial do addon. A primeira etapa implementa a fundação técnica: Behavior Pack, Resource Pack, Script API, runtime Lua incorporado e pipeline de compilação para gerar um arquivo `.mcaddon`.

### Alvo inicial
- Minecraft Bedrock 1.26.60 (compatibilidade futura será validada por testes; não é possível garantir versões futuras sem atualização).
- Script API `@minecraft/server` 2.11.0.
- Lua executado por uma VM incorporada ao pacote, não por uma falsa simulação em JavaScript.

## Compilar

Requer Node.js 20 ou superior.

```sh
npm ci
npm run build
```

O artefato será gerado em `dist/ComputerCraft-Bedrock-Advanced.mcaddon`.

No GitHub, a ação **Build Addon** compila o projeto e publica o arquivo como artefato de workflow.

## Primeira etapa

1. Computador de Blocos com identificação individual.
2. Interface de computador e terminal.
3. Interpretador Lua incorporado.
4. Armazenamento inicial de arquivos por computador.
5. Base para periféricos e integração com redstone.

## Aviso técnico

A API oficial do Bedrock é JavaScript. O projeto incorpora Fengari (VM Lua escrita em JavaScript) para executar Lua real dentro do Behavior Pack. O acesso ao mundo é exposto ao Lua por APIs controladas do addon; nem todas as APIs de JavaScript ficam disponíveis diretamente aos programas Lua.
