import { motion } from '../lib/motion-settings';


export function initMotion() {
  const root = document.documentElement;
  const cursor = document.querySelector<HTMLElement>('.motion-cursor')!;
  const dot = cursor.querySelector<HTMLElement>('.motion-dot')!;
  const ring = cursor.querySelector<HTMLElement>('.motion-ring')!;
  const bars = [...document.querySelectorAll<HTMLElement>('.motion-columns>span')];
  const caption = document.querySelector<HTMLElement>('.motion-caption')!;
  const title = caption.querySelector<HTMLElement>('[data-motion-title]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let controller: AbortController;
  let raf = 0, lastTime = 0, x = 0, y = 0, rx = 0, ry = 0;
  let scale: number = motion.idleScale, wantedScale: number = scale;
  let pointerVisible = false;
  let animations: Animation[] = [];

  const animate = (el: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const a = el.animate(frames, options); animations.push(a); return a;
  };
  const hideCursor = () => {
    pointerVisible = false; root.classList.remove('cursor-active');
    cursor.classList.remove('is-view'); cancelAnimationFrame(raf); raf = 0; lastTime = 0;
  };
  const draw = (time: number) => {
    raf = 0;
    if (!pointerVisible) return;
    const dt = Math.min(lastTime ? time-lastTime : 16.7, 50); lastTime = time;
    const follow = 1-Math.exp(-dt/motion.followMs), grow = 1-Math.exp(-dt/motion.scaleMs);
    rx += (x-rx)*follow; ry += (y-ry)*follow; scale += (wantedScale-scale)*grow;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    ring.style.transform = `translate3d(${rx-motion.ring/2}px,${ry-motion.ring/2}px,0) scale(${scale})`;
    if (Math.abs(x-rx)+Math.abs(y-ry)+Math.abs(scale-wantedScale)*100 > .05) raf = requestAnimationFrame(draw);
  };
  const pointer = (e: PointerEvent) => {
    if (reduced.matches || !fine.matches || e.pointerType !== 'mouse') {hideCursor();return;}
    const el = e.target instanceof Element ? e.target : null;
    // Keep native I-beams, selection, media controls and download affordances.
    if (!el || e.buttons || el.closest('input,textarea,select,[contenteditable],video,a[download],a[href*="/downloads/"],a[href*="/media/"],iframe')) {hideCursor();return;}
    x=e.clientX;y=e.clientY;
    const link=el.closest<HTMLAnchorElement>('a[href]');
    const view=!!link && /\/projects\/[^/]+\/?$/.test(new URL(link.href).pathname);
    wantedScale=view?1:motion.idleScale;cursor.classList.toggle('is-view',view);
    cursor.classList.toggle('on-light',!view && !!el.closest('.nav-list li:last-child a,.view-switch button[aria-pressed="true"]'));
    if (!pointerVisible) {rx=x;ry=y;scale=wantedScale;pointerVisible=true;}
    root.classList.add('cursor-active');
    if (!raf) raf=requestAnimationFrame(draw);
  };
  const wipe = document.querySelector<HTMLElement>('.motion-wipe')!;
  let serial = 0, busy = false, traverse = false;
  let cover: Promise<unknown> = Promise.resolve();
  const cancelAnimations = () => { animations.forEach(a => a.cancel()); animations = []; };
  const reset = () => {
    cancelAnimations(); busy = false;
    wipe.classList.remove('is-active'); root.classList.remove('motion-busy');
    bars.forEach(bar => bar.style.transform = ''); caption.style.opacity = '';
  };
  type Preparation = Event & { loader: () => Promise<void>; signal: AbortSignal; to: URL; sourceElement?: Element; navigationType: string; newDocument: Document };
  type Swap = Event & { newDocument: Document; viewTransition: { ready: Promise<void>; skipTransition(): void } };
  document.addEventListener('astro:before-preparation', raw => {
    const event = raw as Preparation, id = ++serial;
    // An in-page anchor can abort a pending route without starting another wipe.
    // Let a newer preparation take ownership before deciding to release this one.
    event.signal.addEventListener('abort', () => queueMicrotask(() => {
      if (id === serial) { serial++; reset(); }
    }), {once: true});
    traverse = event.navigationType === 'traverse';
    hideCursor();
    const value = event.sourceElement?.getAttribute('aria-label') ?? event.sourceElement?.querySelector('h2,h3')?.textContent ?? event.sourceElement?.textContent ?? event.to.pathname.split('/').filter(Boolean).at(-1) ?? 'Home';
    const name = value.replace(/[↗→]/g, '').replace(/\s+/g, ' ').trim();
    title.textContent = name; caption.classList.toggle('is-long', name.length > 18);
    // Continue from the actual visible positions when a newer click supersedes a flight.
    const starts = bars.map(bar => busy ? getComputedStyle(bar).transform : 'translateY(101%)');
    cancelAnimations(); busy = true; root.classList.add('motion-busy');
    if (!reduced.matches) {
      wipe.classList.add('is-active');
      animate(caption, [{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}], {duration:260,delay:320,fill:'forwards'});
      cover = Promise.all(bars.map((bar, i) => animate(bar,
        [{transform:starts[i]},{transform:'translateY(0)'}],
        {duration:motion.coverMs,delay:i*motion.staggerMs,easing:motion.ease,fill:'both'}
      ).finished.catch(() => undefined)));
    } else { cover = Promise.resolve(); }
    // Fetch/style preparation and the cover run together, beginning in this event.
    const load = event.loader;
    event.loader = async () => {
      try {
        await Promise.all([load(), cover]);
        if (event.signal.aborted || id !== serial) return;
        // Pre-decode initial eager imagery while still covered. Errors don't hide content.
        const pictures = [...event.newDocument.querySelectorAll<HTMLImageElement>('img[loading="eager"]')];
        await Promise.all(pictures.map(async image => {
          const preload = new Image(); preload.srcset = image.srcset; preload.sizes = image.sizes;
          preload.src = image.src; await preload.decode().catch(() => undefined);
        }));
      } catch (error) { if (id === serial) reset(); throw error; }
    };
  });
  document.addEventListener('astro:before-swap', raw => {
    const event = raw as Swap;
    // Keep the live columns; browser snapshot transitions would obscure their motion.
    // Skipping intentionally rejects native `ready`; consume that expected rejection.
    void event.viewTransition.ready.catch(() => undefined);
    event.viewTransition.skipTransition();
    if (busy) event.newDocument.documentElement.classList.add('motion-busy');
    event.newDocument.documentElement.removeAttribute('data-entrance-armed');
  });
  document.addEventListener('astro:page-load', async () => {
    if (!busy) return;
    const id = serial;
    await document.fonts.ready;
    if (id !== serial) return;
    if (!reduced.matches) {
      animate(caption,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-50px)'}],{duration:240,fill:'forwards'});
      await Promise.all(bars.map((bar,i)=>animate(bar,[{transform:'translateY(0)'},{transform:'translateY(-101%)'}],
        {duration:motion.revealMs,delay:i*motion.staggerMs,easing:motion.ease,fill:'both'}).finished.catch(()=>undefined)));
    }
    if (id !== serial) return;
    reset();
    if (!traverse) {
      let target: HTMLElement | null = null;
      try { if (location.hash) target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch {}
      const focus = target ?? document.querySelector<HTMLElement>('#main');
      if (focus) { if (!focus.hasAttribute('tabindex')) focus.setAttribute('tabindex','-1'); focus.focus({preventScroll:true}); }
    }
  });
  const startCursor = () => {
    controller?.abort(); controller = new AbortController(); const signal = controller.signal;
    document.addEventListener('pointermove',pointer,{passive:true,signal});
    document.addEventListener('pointerover',pointer,{passive:true,signal});
    document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')hideCursor();},{signal});
    document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hideCursor();},{signal});
    document.addEventListener('keydown',hideCursor,{signal});
    window.addEventListener('blur',hideCursor,{signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor();},{signal});
    reduced.addEventListener('change',()=>{hideCursor();if(reduced.matches)reset();},{signal});
    fine.addEventListener('change',hideCursor,{signal});
  };
  startCursor();
  window.addEventListener('pagehide',()=>{controller.abort();hideCursor();reset();});
  window.addEventListener('pageshow',event=>{if(event.persisted){reset();startCursor();}});
}

