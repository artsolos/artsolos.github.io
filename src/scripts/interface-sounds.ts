import { interfaceSound as config } from '../lib/interface-sound-settings';
import { pageDestination } from '../lib/motion-settings';
type Channel = 'click' | 'transition';

/** One persistent dock/player set for the document lifetime. No hover audio. */
export function initInterfaceSounds() {
  const dock = document.querySelector<HTMLElement>('.sound-dock');
  if (!dock || dock.dataset.initialized) return;
  dock.dataset.initialized = 'true';
  const audio = Object.fromEntries(['click', 'transition'].map(key =>
    [key, dock.querySelector<HTMLAudioElement>(`audio[data-sound="${key}"]`)!])) as Record<Channel, HTMLAudioElement>;
  const toggle = dock.querySelector<HTMLButtonElement>('[data-sound-toggle]')!;
  const settingsToggle = dock.querySelector<HTMLButtonElement>('[data-sound-settings]')!;
  const panel = dock.querySelector<HTMLElement>('.sound-settings')!;
  const volumeInput = dock.querySelector<HTMLInputElement>('#sound-volume')!;
  const volumeLabel = dock.querySelector<HTMLOutputElement>('output')!;
  const status = dock.querySelector<HTMLElement>('.sound-status')!;
  const options: Record<Channel, boolean> = { click: true, transition: true };
  let volume: number = config.defaultVolume, enabled = false, error = '';
  const generations: Record<Channel, number> = { click: 0, transition: 0 };
  const gain: Record<Channel, number> = { click: config.clickGain, transition: config.transitionGain };
  try {
    const saved = JSON.parse(localStorage.getItem(config.preferencesKey) || 'null');
    if (typeof saved?.volume === 'number' && Number.isFinite(saved.volume)) volume = Math.max(0, Math.min(1, saved.volume));
    for (const key of Object.keys(options) as Channel[]) if (typeof saved?.options?.[key] === 'boolean') options[key] = saved.options[key];
    enabled = sessionStorage.getItem(config.sessionKey) === 'true';
  } catch { /* Controls work without storage. */ }
  const allowed = (key: Channel) => enabled && options[key] && volume > 0 && !document.hidden &&
    ![...document.querySelectorAll<HTMLVideoElement>('video')].some(v => !v.paused && !v.ended);
  const save = () => { try { localStorage.setItem(config.preferencesKey, JSON.stringify({ volume, options })); sessionStorage.setItem(config.sessionKey, String(enabled)); } catch {} };
  const paint = () => {
    toggle.textContent = enabled ? 'Sound on' : 'Sound off';
    toggle.setAttribute('aria-pressed', String(enabled));
    status.textContent = error || (enabled ? (volume === 0 ? 'Volume muted' : 'Interface sounds') : 'Sound starts off');
    volumeInput.value = String(Math.round(volume * 100)); volumeLabel.textContent = `${volumeInput.value}%`;
    volumeInput.setAttribute('aria-valuetext', `${volumeInput.value} percent`);
    for (const key of Object.keys(options) as Channel[]) {
      dock.querySelector<HTMLInputElement>(`[data-sound-option="${key}"]`)!.checked = options[key];
      audio[key].volume = volume * gain[key];
    }
  };
  const stop = (key: Channel) => { generations[key]++; audio[key].pause(); audio[key].currentTime = 0; };
  const stopAll = () => { stop('click'); stop('transition'); };
  const play = async (key: Channel) => {
    if (!allowed(key)) return;
    const token = ++generations[key], media = audio[key];
    media.currentTime = 0;
    try { await media.play(); if (token === generations[key] && allowed(key)) { error = ''; paint(); } }
    catch (reason) {
      if (token !== generations[key] || (reason instanceof DOMException && reason.name === 'AbortError')) return;
      error = 'Audio unavailable — try Sound off/on'; paint();
    }
  };
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('.sound-dock,input,textarea,select,[contenteditable]') || event.button !== 0) return;
    const control = target.closest('a[href],button,[role="button"],summary');
    if (!control || control.matches(':disabled,[aria-disabled="true"]')) return;
    void play('click');
    const link = target.closest<HTMLAnchorElement>('.site-header a[href],.site-footer a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.download || (link.target && link.target !== '_self')) return;
    if (pageDestination(link.href, location.href)) void play('transition');
  }, { capture: true });
  // Real visibility/video pauses only. Astro route changes never touch the players.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  document.addEventListener('play', event => { if (event.target instanceof HTMLVideoElement) stopAll(); }, { capture: true });
  const size = () => {
    document.body.classList.add('has-interface-sounds');
    document.body.style.setProperty('--sound-dock-height', `${dock.getBoundingClientRect().height}px`);
  };
  new ResizeObserver(size).observe(dock);
  document.addEventListener('astro:after-swap', size);
  toggle.addEventListener('click', () => {
    enabled = !enabled; error = ''; save(); paint();
    if (!enabled) stopAll(); else void play('click');
  });
  settingsToggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden; settingsToggle.setAttribute('aria-expanded', String(!panel.hidden));
    size(); if (!panel.hidden) volumeInput.focus();
  });
  dock.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { panel.hidden = true; settingsToggle.setAttribute('aria-expanded', 'false'); size(); settingsToggle.focus(); }
  });
  volumeInput.addEventListener('input', () => { volume = Number(volumeInput.value) / 100; if (!volume) stopAll(); save(); paint(); });
  dock.querySelectorAll<HTMLInputElement>('[data-sound-option]').forEach(input => input.addEventListener('change', () => {
    const key = input.dataset.soundOption as Channel; options[key] = input.checked;
    if (!input.checked) stop(key); save(); paint();
  }));
  dock.hidden = false; paint(); size();
}

