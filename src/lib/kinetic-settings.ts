export const kinetic={followMs:125,maxStretch:.5,settle:.0008} as const;
/** Local width response; shared normalization keeps every glyph inside its line. */
export function kineticScales(widths:number[],centers:number[],pointer:{x:number;y:number}|null,centerY:number,radius:number,lineWidth:number){
 const raw=widths.map((_,i)=>{const distance=pointer?Math.hypot(pointer.x-centers[i],pointer.y-centerY):radius;const influence=Math.max(0,1-distance/radius);return 1+kinetic.maxStretch*influence;});
 const total=raw.reduce((sum,s,i)=>sum+s*widths[i],0),base=widths.reduce((a,b)=>a+b,0);
 const fit=total>Math.max(base,lineWidth)?Math.max(base,lineWidth)/total:1;
 return raw.map(s=>s*fit);
}
