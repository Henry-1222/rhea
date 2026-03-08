export enum ToolMode {
  SCANNER = 'SCANNER',
  CLAW = 'CLAW',
  FLASHLIGHT = 'FLASHLIGHT',
  HACKER = 'HACKER',
}

export type Language = 'EN' | 'ZH';

export interface GameState {
  currentRoom: string;
  inventory: string[];
  powerRestored: boolean;
  terminalUnlocked: boolean;
  coreStabilized: boolean;
  scannedObjects: Set<string>;
  messages: string[];
  language: Language;
}

export interface ScannableObject {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  translatedText: string;
  translatedTextZh: string;
  position: { x: number; y: number };
}
