import {entrance} from '../lib/entrance-settings';
import {syncNameReveal} from './name-depth';

export function initEntrances(){
 const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const load=[...document.querySelectorAll<HTMLElement>('[data-entrance-load]')];
 const selectors=['.editorial-section-head','.home-about>h2','.home-about>div',
  '.contact-section>p','.contact-section>h2','.contact-section>.contact',
  '.project-preview.selected .preview-copy','.project-preview:not(.selected) .preview-copy>h2',
  '.project-preview:not(.selected) .preview-copy>p','.project-preview:not(.selected) .preview-context',
  '.project-preview:not(.selected) .preview-meta>span','.card>.body','.section-head','.course-row','.course-group>h2','.course-group>p',
  '.case .contribution-summary','.case .overview>.inline-links','.case .facts',
  '.case .prose>h2','.case .prose>h3','.case .prose>p','.case .prose>ul','.case .prose>ol',
  '.case .links-panel','.case .sources','.about-text>p','.about-text>.edu',
  '.cap>h3','.cap>p','.cap>ul','.lab-sequence','.collection-footer'];
 const candidates=[...document.querySelectorAll<HTMLElement>(selectors.join(','))];
 const targets=candidates.filter(el=>!load.some(parent=>parent===el||parent.contains(el))
  && !candidates.some(parent=>parent!==el&&parent.contains(el))
  && !el.querySelector('img,video,svg,canvas,iframe'));
 const seen=new WeakSet<HTMLElement>(),running=new Map<HTMLElement,Animation>();
 let observer:IntersectionObserver|undefined,gate:MutationObserver|undefined,started=false,raf=0;
 const controller=new AbortController(),signal=controller.signal;
 const finish=(el:HTMLElement)=>{seen.add(el);running.get(el)?.cancel();running.delete(el);observer?.unobserve(el);};
 const showAll=()=>{load.forEach(finish);targets.forEach(finish);root.removeAttribute('data-entrance-armed');gate?.disconnect();observer?.disconnect();cancelAnimationFrame(raf);raf=0;};
 // A failed setup can never leave a paused animation hiding content.
 const watchdog=window.setTimeout(showAll,entrance.failOpenMs);
 const animate=(el:HTMLElement,delay:number,paused=false)=>{
  seen.add(el);el.dataset.entranceSeen='';
  const a=el.animate([{opacity:0,translate:`0 ${entrance.distance}px`},{opacity:1,translate:'0 0'}],
   {duration:entrance.duration,delay,easing:entrance.ease,fill:'backwards'});
  if(paused)a.pause();running.set(el,a);
  void a.finished.then(()=>{if(running.get(el)===a){running.delete(el);a.cancel();}},()=>{});
 };
 const routeArrival=root.classList.contains('motion-busy');
 const initialAllowed=root.hasAttribute('data-entrance-armed')||routeArrival;
 const historyVisit=performance.getEntriesByType('navigation').some(e=>(e as PerformanceNavigationTiming).type==='back_forward');
 if(reduced.matches||(historyVisit&&!routeArrival)){clearTimeout(watchdog);showAll();return;}
 try{
  if(initialAllowed)load.forEach((el,i)=>animate(el,Math.min(i*entrance.stagger,entrance.maxStagger),true));
  else load.forEach(finish);
  // Install the hidden first frame while the destination is still fully covered.
  // The gate below releases these paused entrances as the wipe finishes, before
  // the next paint. Never expose the settled text and then hide it to animate.
  if(routeArrival){
   const groups=new Map<Element,number>();
   targets.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top>=innerHeight||rect.bottom<=0||el.closest('[hidden]'))return;
    if(rect.top<0||el.contains(document.activeElement)){finish(el);return;}
    const group=el.closest('[data-project],.cap,.prose')??el;
    if(!groups.has(group))groups.set(group,groups.size);
    animate(el,Math.min(groups.get(group)!*entrance.stagger,entrance.maxStagger),true);
   });
  }
  root.removeAttribute('data-entrance-armed');
  const begin=()=>{
   if(started||root.hasAttribute('data-motion-arriving')||root.classList.contains('motion-busy'))return;
   started=true;gate?.disconnect();clearTimeout(watchdog);
   running.forEach(a=>a.play());
   // During only the name wrapper entrance, keep the existing cutouts in screen alignment.
   const align=()=>{raf=0;syncNameReveal();if([...running.keys()].some(el=>el.classList.contains('name-entrance')))raf=requestAnimationFrame(align);};
   if(running.size)raf=requestAnimationFrame(align);
   if(!('IntersectionObserver' in window)){targets.forEach(finish);return;}
   observer=new IntersectionObserver(entries=>{
    if(root.classList.contains('motion-busy'))return;
    const entering=entries.filter(e=>e.isIntersecting&&!seen.has(e.target as HTMLElement));
    const groups=new Map<Element,number>();
    entering.forEach(entry=>{
     const el=entry.target as HTMLElement;observer?.unobserve(el);
     if(el.closest('[hidden]')||entry.boundingClientRect.top<0||el.contains(document.activeElement)){finish(el);return;}
     const group=el.closest('[data-project],.cap,.prose')??el;
     if(!groups.has(group))groups.set(group,groups.size);
     animate(el,Math.min(groups.get(group)!*entrance.stagger,entrance.maxStagger));
    });
   },{threshold:0,rootMargin:'0px 0px -24px 0px'});
   targets.forEach(el=>{if(el.getBoundingClientRect().bottom<=0)finish(el);else observer?.observe(el);});
  };
  gate=new MutationObserver(begin);gate.observe(root,{attributes:true,attributeFilter:['class','data-motion-arriving']});begin();
  document.addEventListener('focusin',e=>{if(!(e.target instanceof Element)||e.target.id==='main')return;
   [...load,...targets].filter(el=>el===e.target||el.contains(e.target as Node)||(e.target as Element).contains(el)).forEach(finish);
  },{signal});
  // No delayed/replayed results after a local filter/search/view activation.
  const finishResults=(e:Event)=>{const el=e.target instanceof Element?e.target:null;
   if(el?.closest('[data-work-tools],[data-view-switch]'))targets.filter(t=>t.closest('[data-project]')).forEach(finish);
  };
  document.addEventListener('input',finishResults,{signal});document.addEventListener('click',finishResults,{signal});
  const anchor=()=>{if(location.hash)showAll();};window.addEventListener('hashchange',anchor,{signal});
  if(location.hash)showAll();
  reduced.addEventListener('change',()=>{if(reduced.matches)showAll();},{signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)showAll();},{signal});
 }catch{clearTimeout(watchdog);showAll();}
 return ()=>{clearTimeout(watchdog);showAll();controller.abort();};
}
