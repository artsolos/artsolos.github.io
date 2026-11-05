/** Local reveal only; the original kinetic width response stays independent. */
export const nameDepth={radiusEm:.33,minRadius:30,maxRadius:70,bands:[1,.66,.35],points:24,trailMs:85,maxTrail:58,openMs:75,closeMs:135,settleMs:1100} as const;

/** Decorative offsets only. Never change the existing kinetic width response. */
export const nameParallax = {
  maxX: 2.8, maxY: 2, restX: .2, restY: .25,
  followMs: 110, returnMs: 180, settle: .002,
} as const;
