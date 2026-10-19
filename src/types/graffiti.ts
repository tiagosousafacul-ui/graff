export type DesignTheme = 'nature' | 'geometric' | 'letters3d';

export interface CustomPalette {
  topFill: string;
  bottomFill: string;
  extrusion3d: string;
  powerGreen: string;
  outline: string;
  highlights: string;
  halo: string;
}

export interface ColorwayPreset {
  id: string;
  name: string;
  tag: string;
  description: string;
  palette: CustomPalette;
}

export interface DiagramLayer {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  tag: string;
  description: string;
  capUsed: string;
  sprayTechnique: string;
  visible: boolean;
  opacity: number;
}

export interface GraffitiStep {
  id: number;
  title: string;
  phase: string;
  colorUsed: string;
  accentColor: string;
  capRecommended: string;
  sprayDistance: string;
  pressure: string;
  summary: string;
  detailedSteps: string[];
  proTips: string[];
  mistakesToAvoid: string[];
}

export interface SprayCan {
  id: string;
  name: string;
  colorName: string;
  hex: string;
  tone: 'red' | 'blue' | 'green' | 'black' | 'white' | 'orange' | 'yellow' | 'purple' | 'pink' | 'cyan' | 'grey' | 'gold';
  roleInDesign: string;
  recommendedCap: string;
  pressureType: string;
}

export interface SprayCap {
  id: string;
  name: string;
  strokeWidth: string;
  pressure: string;
  bestFor: string;
  iconType: string;
}
