import {kinetic,kineticScales} from '../lib/kinetic-settings';
import {addNameLayers,syncNameReveal} from './name-depth';

export function initKineticText(){
 const roots=[...document.querySelectorAll<HTMLElement>('[data-kinetic-line]')];if(!roots.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 const lines=roots.map(root=>({root,box:root.querySelector<HTMLElement>('.kinetic-text')!,text:root.querySelector('.kinetic-text')!.textContent!,letters:[] as HTMLElement[],widths:[] as number[],offsets:[] as number[],current:[] as number[],target:[] as number[],base:0,height:0}));
 let control:AbortController,observer:ResizeObserver,raf=0,previous=0,point:{x:number;y:number}|null=null;
 const enabled=()=>fine.matches&&!reduced.matches;
 const render=()=>{
   for(const line of lines){
    const total=line.widths.reduce((sum,w,i)=>sum+w*line.current[i],0);
    let shift=line.root.dataset.align==='end'?line.base-total:0;
    line.letters.forEach((letter,i)=>{letter.style.transform=`translate3d(${shift}px,0,0) scaleX(${line.current[i]})`;shift+=line.widths[i]*(line.current[i]-1);});
   }
   syncNameReveal();
 };
 const tick=(time:number)=>{
   raf=0;const dt=Math.min(previous?time-previous:16.67,50);previous=time;
   const blend=1-Math.exp(-dt/kinetic.followMs);let moving=false;
   for(const line of lines)line.current=line.current.map((value,i)=>{const delta=line.target[i]-value;if(Math.abs(delta)<kinetic.settle)return line.target[i];moving=true;return value+delta*blend;});
   render();if(moving)raf=requestAnimationFrame(tick);else previous=0;
 };
 const update=()=>{
   for(const line of lines){
    const r=line.root.getBoundingClientRect();const start=r.left+(line.root.dataset.align==='end'?r.width-line.base:0);
    line.target=kineticScales(line.widths,line.offsets.map((x,i)=>start+x+line.widths[i]/2),enabled()?point:null,r.top+line.height/2,Number(line.root.dataset.radius),Math.max(0,r.width-2));
   }
   if(!raf&&enabled())raf=requestAnimationFrame(tick);
 };
 const measure=()=>{
   cancelAnimationFrame(raf);raf=0;previous=0;
   for(const line of lines){
    line.box.textContent=line.text;line.box.style.width='';line.box.style.height='';
    line.letters=[];line.widths=[];line.offsets=[];line.current=[];line.target=[];
    if(!enabled())continue;
    const node=line.box.firstChild!,range=document.createRange(),rects:DOMRect[]=[];
    for(let i=0;i<line.text.length;i++){range.setStart(node,i);range.setEnd(node,i+1);rects.push(range.getBoundingClientRect());}
    const box=line.box.getBoundingClientRect();line.base=box.width;line.height=box.height;
    line.box.style.width=`${box.width}px`;line.box.style.height=`${box.height}px`;line.box.textContent='';
    rects.forEach((rect,i)=>{
     const offset=rect.left-box.left;const width=i+1<rects.length?rects[i+1].left-rect.left:box.width-offset;
     const letter=document.createElement('span');letter.className='kinetic-letter';letter.textContent=line.text[i];letter.style.left=`${offset}px`;
     if(line.root.closest('.home-name'))addNameLayers(letter);
     line.box.append(letter);line.letters.push(letter);line.offsets.push(offset);line.widths.push(width);line.current.push(1);line.target.push(1);
    });
   }
   update();
 };
 const rest=()=>{point=null;update();};
 const stop=()=>{control?.abort();observer?.disconnect();cancelAnimationFrame(raf);raf=0;point=null;previous=0;};
 const start=()=>{
   stop();control=new AbortController();const signal=control.signal;
   document.addEventListener('pointermove',e=>{point=e.pointerType==='mouse'&&!e.buttons?{x:e.clientX,y:e.clientY}:null;update();},{passive:true,signal});
   document.addEventListener('pointerout',e=>{if(!e.relatedTarget)rest();},{signal});
   document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')rest();},{signal});
   document.addEventListener('keydown',rest,{signal});window.addEventListener('blur',rest,{signal});
   document.addEventListener('visibilitychange',()=>{if(document.hidden){point=null;cancelAnimationFrame(raf);raf=0;for(const line of lines){line.current=line.current.map(()=>1);line.target=line.current.slice();}render();}},{signal});
   window.addEventListener('scroll',update,{passive:true,signal});
   reduced.addEventListener('change',measure,{signal});fine.addEventListener('change',measure,{signal});
   observer=new ResizeObserver(measure);roots.forEach(root=>observer.observe(root));measure();
 };
 start();void document.fonts.ready.then(()=>{if(!control.signal.aborted)measure();});
 return stop;
}
