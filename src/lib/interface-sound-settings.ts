/** Supplied recordings, independently adjustable playback levels. */
export const interfaceSound = {
  defaultVolume: .25,
  clickGain: .65,
  transitionGain: .7,
  preferencesKey: 'portfolio:interface-sound-preferences:v1',
  sessionKey: 'portfolio:interface-sounds-enabled:v1',
  /** Set on the first document load of a session; the Home sound choice shows only before it exists. */
  entryKey: 'portfolio:entry-choice-seen:v1',
  /** Dispatched on document by the entry choice; detail.enabled is the visitor's explicit choice. */
  choiceEvent: 'portfolio:sound-choice',
} as const;
