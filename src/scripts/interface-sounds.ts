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
  const trigger = dock.querySelector<HTMLButtonElement>('[data-sound-trigger]')!;
  const triggerLabel = trigger.querySelector<HTMLElement>('.sound-trigger-label')!;
  const panel = dock.querySelector<HTMLElement>('.sound-panel')!;
  const master = dock.querySelector<HTMLButtonElement>('[data-sound-master]')!;
  const volumeInput = dock.querySelector<HTMLInputElement>('#sound-volume')!;
  const volumeLabel = dock.querySelector<HTMLOutputElement>('output')!;
  const status = dock.querySelector<HTMLElement>('.sound-status')!;
  const note = dock.querySelector<HTMLElement>('[data-sound-note]')!;
  const switches = [...dock.querySelectorAll<HTMLButtonElement>('[data-sound-option]')];
  const options: Record<Channel, boolean> = { click: true, transition: true };
  let volume: number = config.defaultVolume, enabled = false, error = '', errorTimer = 0;
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
  const setSwitch = (button: HTMLButtonElement, on: boolean) => {
    button.setAttribute('aria-checked', String(on));
    button.querySelector('.sound-switch-state')!.textContent = on ? 'On' : 'Off';
  };
  const paint = () => {
    const muted = enabled && volume === 0;
    dock.classList.toggle('is-on', enabled && !muted);
    triggerLabel.textContent = muted ? 'Muted' : enabled ? 'Sound on' : 'Sound off';
    setSwitch(master, enabled);
    volumeInput.value = String(Math.round(volume * 100)); volumeLabel.textContent = `${volumeInput.value}%`;
    volumeInput.style.setProperty('--fill', `${volumeInput.value}%`);
    volumeInput.setAttribute('aria-valuetext', `${volumeInput.value} percent`);
    switches.forEach(button => setSwitch(button, options[button.dataset.soundOption as Channel]));
    for (const key of Object.keys(options) as Channel[]) audio[key].volume = volume * gain[key];
    note.textContent = enabled ? (muted ? 'Volume is at 0%. Raise it to hear effects.' : 'Brief effects only. You can browse in silence.')
      : 'Off. Your effect choices are kept for when sound is on.';
    status.textContent = error;
  };
  const report = (message: string) => {
    error = message; paint(); clearTimeout(errorTimer);
    if (message) errorTimer = window.setTimeout(() => { error = ''; paint(); }, 8000);
  };
  const stop = (key: Channel) => { generations[key]++; audio[key].pause(); audio[key].currentTime = 0; };
  const stopAll = () => { stop('click'); stop('transition'); };
  const play = async (key: Channel) => {
    if (!allowed(key)) return;
    const token = ++generations[key], media = audio[key];
    media.currentTime = 0;
    try { await media.play(); if (token === generations[key] && error) report(''); }
    catch (reason) {
      if (token !== generations[key] || (reason instanceof DOMException && reason.name === 'AbortError')) return;
      // Never claim sound is on when the browser refused playback: continue quietly.
      enabled = false; stopAll(); save(); report('Sound couldn’t start. Select Sound to try again.');
    }
  };
  const setEnabled = (on: boolean) => {
    enabled = on; save(); report('');
    if (!enabled) stopAll(); else void play('click');
  };
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('.sound-dock,.entry-choice,input,textarea,select,[contenteditable]') || event.button !== 0) return;
    const control = target.closest('a[href],button,[role="button"],summary');
    if (!control || control.matches(':disabled,[aria-disabled="true"]')) return;
    void play('click');
    const link = target.closest<HTMLAnchorElement>('.site-header a[href],.site-footer a[href]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.download || (link.target && link.target !== '_self')) return;
    if (pageDestination(link.href, location.href)) void play('transition');
  }, { capture: true });
  // The first-visit choice is an explicit gesture; its click handler dispatches synchronously.
  document.addEventListener(config.choiceEvent, event => {
    const on = (event as CustomEvent<{ enabled?: boolean }>).detail?.enabled === true;
    event.preventDefault(); setEnabled(on);
  });
  // Real visibility/video pauses only. Astro route changes never touch the players.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  document.addEventListener('play', event => { if (event.target instanceof HTMLVideoElement) stopAll(); }, { capture: true });
  const reserve = () => document.body.classList.add('has-interface-sounds');
  document.addEventListener('astro:after-swap', reserve);

  const open = () => !panel.hidden;
  const setOpen = (next: boolean, returnFocus = false) => {
    if (next === open()) return;
    panel.hidden = !next; trigger.setAttribute('aria-expanded', String(next));
    if (next) report('');
    if (!next && returnFocus) trigger.focus();
  };
  trigger.addEventListener('click', () => setOpen(!open()));
  dock.querySelector('[data-sound-close]')!.addEventListener('click', () => setOpen(false, true));
  dock.addEventListener('keydown', event => { if (event.key === 'Escape' && open()) { event.stopPropagation(); setOpen(false, true); } });
  dock.addEventListener('focusout', event => {
    if (open() && event.relatedTarget instanceof Node && !dock.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('pointerdown', event => { if (open() && !dock.contains(event.target as Node)) setOpen(false); });
  document.addEventListener('astro:before-swap', () => setOpen(false));

  master.addEventListener('click', () => setEnabled(!enabled));
  volumeInput.addEventListener('input', () => { volume = Number(volumeInput.value) / 100; if (!volume) stopAll(); save(); paint(); });
  switches.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.soundOption as Channel; options[key] = !options[key];
    if (!options[key]) stop(key); save(); paint();
  }));
  dock.hidden = false; paint(); reserve();
}
