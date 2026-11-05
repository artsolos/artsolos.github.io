/** Page-scoped enhancements mount once per Astro swap and release global work. */
export function onPage(init: (signal: AbortSignal) => void | (() => void)) {
  let controller: AbortController | undefined;
  let dispose: void | (() => void);
  const stop = () => { controller?.abort(); dispose?.(); dispose = undefined; };
  const start = () => { stop(); controller = new AbortController(); dispose = init(controller.signal); };
  document.addEventListener('astro:page-load', start);
  document.addEventListener('astro:before-swap', stop);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', event => { if (event.persisted) start(); });
}
