export interface ComputerSession {
  computerId: string;
  currentFile: string;
  source: string;
  running: boolean;
}

export function createComputerSession(computerId: string): ComputerSession {
  return { computerId, currentFile: "startup.lua", source: "-- ComputerCraft Bedrock Advanced\nprint(\"Olá, mundo!\")", running: false };
}
