import HexapodStack from './HexapodStack.astro';
import TripodGait from './TripodGait.astro';
import HpsFpgaPath from './HpsFpgaPath.astro';

// Diagrams drawn for this portfolio from descriptions and code in the source
// reports. Captions say so, so they are never mistaken for original figures.
export const diagrams = {
  'hexapod-stack': {
    component: HexapodStack,
    caption:
      'The Spider control program as layered in the Lab 9 report. Highlighted blocks are the files I changed. Drawn for this portfolio from the report.',
  },
  'tripod-gait': {
    component: TripodGait,
    caption:
      'Leg groups from the code comments in my report (Tripod 1: RF, LM, RB; Tripod 2: LF, RM, LB) and the stride signs for a left turn. Drawn for this portfolio.',
  },
  'hps-fpga-path': {
    component: HpsFpgaPath,
    caption:
      'Path from a C++ write to servo motion, using the bridge base address and PIO offset from the Lab 8 code. Drawn for this portfolio.',
  },
} as const;

export type DiagramId = keyof typeof diagrams;
