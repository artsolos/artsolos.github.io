import {nameParallax as settings} from '../lib/name-depth-settings';

// Restored from the pre-name-reveal checkpoint. Independent of local cutouts.
export function initNameParallax(){
  const heading=document.querySelector<HTMLElement>('.home-name');if(!heading)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let control:AbortController,raf=0,previous=0,active=false;
  let x:number=settings.restX,y:number=settings.restY,targetX=x,targetY=y;
  const enabled=()=>fine.matches&&!reduced.matches;
  const render=()=>{heading.style.setProperty('--name-depth-x',`${x}px`);heading.style.setProperty('--name-depth-y',`${y}px`);};
  const tick=(time:number)=>{
    raf=0;const dt=Math.min(previous?time-previous:16.67,50);previous=time;
    const blend=1-Math.exp(-dt/(active?settings.followMs:settings.returnMs));
    x+=(targetX-x)*blend;y+=(targetY-y)*blend;
    if(Math.abs(targetX-x)<settings.settle&&Math.abs(targetY-y)<settings.settle){x=targetX;y=targetY;previous=0;render();return;}
    render();raf=requestAnimationFrame(tick);
  };
  const schedule=()=>{if(!raf&&enabled())raf=requestAnimationFrame(tick);};
  const reset=(immediate=false)=>{
    active=false;targetX=settings.restX;targetY=settings.restY;
    if(immediate||!enabled()){cancelAnimationFrame(raf);raf=0;previous=0;x=targetX;y=targetY;render();}
    else schedule();
  };
  const stop=()=>{control?.abort();reset(true);};
  const start=()=>{
    stop();control=new AbortController();const signal=control.signal;
    heading.addEventListener('pointermove',e=>{
      if(!enabled()||e.pointerType!=='mouse'||e.buttons){reset();return;}
      const r=heading.getBoundingClientRect();
      active=true;
      targetX=settings.restX+Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1))*settings.maxX;
      targetY=settings.restY+Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1))*settings.maxY;
      schedule();
    },{passive:true,signal});
    heading.addEventListener('pointerleave',()=>reset(),{signal});
    heading.addEventListener('pointerdown',()=>reset(),{signal});
    window.addEventListener('blur',()=>reset(),{signal});
    window.addEventListener('scroll',()=>reset(),{passive:true,signal});
    window.addEventListener('resize',()=>reset(true),{passive:true,signal});
    document.addEventListener('keydown',()=>reset(),{signal});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)reset(true);},{signal});
    reduced.addEventListener('change',()=>reset(true),{signal});fine.addEventListener('change',()=>reset(true),{signal});
  };
  start();return stop;
}
