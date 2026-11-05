export interface Point {x:number;y:number}
/** Correlated asymmetric contours; no time-driven noise or idle oscillation. */
export function contour(center:Point,trail:Point,radius:number,band:number,index:number,count:number):Point[]{
 const length=Math.hypot(trail.x,trail.y),angle=length>.1?Math.atan2(trail.y,trail.x):0;
 const speed=Math.min(1,length/58),phase=center.x*.002+center.y*.003;
 return Array.from({length:count},(_,i)=>{
  const t=i/count*Math.PI*2,c=Math.cos(t),s=Math.sin(t);
  const worldAngle=t+angle;
  const wave=1+.16*Math.sin(3*worldAngle+phase+index*.09)+.09*Math.cos(5*worldAngle-.7)+.08*Math.sin(2*worldAngle+1.1);
  const r=radius*band*wave;
  const along=r*c*(1+.45*speed)-length*band*.72*Math.max(0,-c)**2;
  const across=r*s+length*band*.14*Math.sin(2*t);
  return {x:center.x+along*Math.cos(angle)-across*Math.sin(angle),y:center.y+along*Math.sin(angle)+across*Math.cos(angle)};
 });
}
/** Closed Catmull-Rom cubic path, inverse-mapped into a moving glyph. */
export function cutoutPath(points:Point[],left:number,top:number,scaleX:number):string{
 const p=points.map(v=>({x:(v.x-left)/scaleX,y:v.y-top})),n=p.length,f=(v:number)=>v.toFixed(2);
 let path=`M-2000 -2000H4000V4000H-2000Z M${f(p[0].x)} ${f(p[0].y)}`;
 for(let i=0;i<n;i++){
  const a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n],d=p[(i+2)%n];
  path+=`C${f(b.x+(c.x-a.x)/6)} ${f(b.y+(c.y-a.y)/6)} ${f(c.x-(d.x-b.x)/6)} ${f(c.y-(d.y-b.y)/6)} ${f(c.x)} ${f(c.y)}`;
 }
 return path+'Z';
}
