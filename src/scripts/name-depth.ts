import {nameDepth as settings} from '../lib/name-depth-settings';
import {contour,cutoutPath,type Point} from '../lib/name-reveal-shape';
const NS='http://www.w3.org/2000/svg';let nextMask=0;
let repaint:(()=>void)|undefined;
/** Re-align after a horizontal animation frame, regardless of RAF callback order. */
export function syncNameReveal(){repaint?.();}
/** Reuse the exact glyph; cutouts never paint outside its silhouette. */
export function addNameLayers(letter:HTMLElement){
 const text=letter.textContent;letter.textContent='';
 // Unmasked foundation. Its offsets must survive before, during and after a cutout.
 for(const depth of [3,2,1]){
  const edge=document.createElement('span');edge.className='name-depth-edge';edge.dataset.depth=String(depth);
  edge.setAttribute('aria-hidden','true');edge.textContent=text;letter.append(edge);
 }
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('width','0');svg.setAttribute('height','0');
 svg.classList.add('name-mask-defs');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 const defs=document.createElementNS(NS,'defs');svg.append(defs);const layers:HTMLElement[]=[];
 for(const depth of [3,2,1]){
  const copy=document.createElement('span');copy.className='name-depth-copy';copy.dataset.depth=String(depth);
  copy.setAttribute('aria-hidden','true');copy.textContent=text;letter.append(copy);layers[depth]=copy;
 }
 const front=document.createElement('span');front.className='name-depth-front';front.textContent=text;letter.append(front);
 [front,layers[1],layers[2]].forEach((layer,i)=>{
  const clip=document.createElementNS(NS,'clipPath'),path=document.createElementNS(NS,'path'),id=`name-cutout-${nextMask++}`;
  clip.id=id;clip.setAttribute('clipPathUnits','userSpaceOnUse');path.setAttribute('clip-rule','evenodd');path.setAttribute('fill-rule','evenodd');
  path.dataset.band=String(i);clip.append(path);defs.append(clip);layer.style.setProperty('--name-cutout',`url(#${id})`);
 });letter.append(svg);
}
export function initNameDepth(){
 const heading=document.querySelector<HTMLElement>('.home-name');if(!heading)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let control:AbortController,observer:IntersectionObserver,raf=0,previous=0,lastInput=0,active=false,visible=true;
 let point:Point={x:0,y:0},lag:Point={x:0,y:0},amount=0,radius=60;
 const enabled=()=>visible&&!document.hidden&&fine.matches&&!reduced.matches;
 const clear=()=>{heading.querySelectorAll('[data-revealed]').forEach(e=>e.removeAttribute('data-revealed'));};
 const render=()=>{
  const dx=point.x-lag.x,dy=point.y-lag.y,length=Math.hypot(dx,dy),limit=length?Math.min(1,settings.maxTrail/length):1;
  const shapes=settings.bands.map((band,i)=>contour(point,{x:dx*limit,y:dy*limit},radius*amount,band,i,settings.points));
  const outer=shapes[0],bounds={left:Math.min(...outer.map(p=>p.x)),right:Math.max(...outer.map(p=>p.x)),top:Math.min(...outer.map(p=>p.y)),bottom:Math.max(...outer.map(p=>p.y))};
  // Read geometry before writes; inverse-map after the original width animation's transforms.
  const glyphs=[...heading.querySelectorAll<HTMLElement>('.kinetic-letter')].map(letter=>({letter,rect:letter.getBoundingClientRect(),scale:new DOMMatrixReadOnly(getComputedStyle(letter).transform).a}));
  for(const {letter,rect,scale} of glyphs){
   const hit=amount>.002&&rect.right>=bounds.left&&rect.left<=bounds.right&&rect.bottom>=bounds.top&&rect.top<=bounds.bottom;
   if(!hit){letter.removeAttribute('data-revealed');continue;}
   letter.querySelectorAll<SVGPathElement>('path[data-band]').forEach((path,i)=>path.setAttribute('d',cutoutPath(shapes[i],rect.left,rect.top,scale||1)));
   letter.setAttribute('data-revealed','');
  }
 };
 const tick=(time:number)=>{
  raf=0;if(!enabled()){reset(true);return;}
  const dt=Math.min(previous?time-previous:16.67,50);previous=time;
  const follow=1-Math.exp(-dt/settings.trailMs);lag.x+=(point.x-lag.x)*follow;lag.y+=(point.y-lag.y)*follow;
  amount+=((active?1:0)-amount)*(1-Math.exp(-dt/(active?settings.openMs:settings.closeMs)));
  if(!active&&amount<.002){amount=0;previous=0;clear();return;}
  render();
  if(!active||time-lastInput<settings.settleMs||Math.hypot(point.x-lag.x,point.y-lag.y)>.02)raf=requestAnimationFrame(tick);else previous=0;
 };
 const schedule=()=>{if(!raf&&enabled())raf=requestAnimationFrame(tick);};
 const reset=(immediate=false)=>{
  active=false;
  if(immediate||!enabled()){cancelAnimationFrame(raf);raf=0;previous=0;amount=0;clear();}else schedule();
 };
 const stop=()=>{repaint=undefined;control?.abort();observer?.disconnect();reset(true);};
 const setRadius=()=>{radius=Math.max(settings.minRadius,Math.min(settings.maxRadius,parseFloat(getComputedStyle(heading).fontSize)*settings.radiusEm));};
 const start=()=>{
  stop();control=new AbortController();const signal=control.signal;setRadius();
  repaint=()=>{if(enabled()&&amount>.002)render();};
  heading.addEventListener('pointermove',e=>{
   if(!enabled()||e.pointerType!=='mouse'||e.buttons){reset();return;}
   point={x:e.clientX,y:e.clientY};if(!active&&amount===0)lag={...point};active=true;lastInput=performance.now();schedule();
  },{passive:true,signal});
  heading.addEventListener('pointerleave',()=>reset(),{signal});heading.addEventListener('pointerdown',()=>reset(),{signal});
  window.addEventListener('blur',()=>reset(),{signal});window.addEventListener('scroll',()=>reset(),{passive:true,signal});
  window.addEventListener('resize',()=>{reset(true);setRadius();},{passive:true,signal});
  document.addEventListener('keydown',()=>reset(),{signal});document.addEventListener('visibilitychange',()=>{if(document.hidden)reset(true);},{signal});
  reduced.addEventListener('change',()=>reset(true),{signal});fine.addEventListener('change',()=>reset(true),{signal});
  observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)reset(true);});observer.observe(heading);
 };
 start();return stop;
}
