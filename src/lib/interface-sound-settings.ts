/** Supplied recordings, independently adjustable playback levels. */
export const interfaceSound = {
  defaultVolume: .25,
  clickGain: .65,
  transitionGain: .7,
  preferencesKey: 'portfolio:interface-sound-preferences:v1',
  sessionKey: 'portfolio:interface-sounds-enabled:v1',
} as const;
