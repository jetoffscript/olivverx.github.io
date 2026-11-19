export const pose=(x=0,y=0,s=1,r=0)=>`translate3d(${x}px,${y}px,0) scale(${s}) rotate(${r}deg)`;
export function composer(root){
 const seq=[],ease=[.22,1,.36,1];
 const all=s=>{
  const targets=typeof s==='string'?[...root.querySelectorAll(s)]:[s];
  if(!targets.length||targets.some(el=>!el))throw new Error(`Animation target not found: ${s}`);
  return targets;
 };
 const anim=(s,v,at,d=.8,e=ease)=>all(s).forEach(el=>seq.push([el,v,{at,duration:d,ease:e}]));
 const move=(s,a,b,at,d=1)=>anim(s,{transform:[a,b]},at,d);
 const fade=(s,a,b,at,d=.5)=>anim(s,{opacity:[a,b]},at,d,'linear');
 const enter=(s,at,x=0,y=0,scale=1,r=0)=>{fade(s,0,1,at);move(s,pose(x,y+24,scale*.92,r),pose(x,y,scale,r),at);};
 const exit=(s,at,d=.5)=>fade(s,1,0,at,d);
 const pulse=(s,at)=>anim(s,{opacity:[0,1,0],transform:[pose(0,0,.7),pose(0,0,1),pose(0,0,1.15)]},at,1.2);
 const flight=(s,at,a,b)=>{enter(s,at,...a);move(s,pose(...a),pose(...b),at+.2,1.2);exit(s,at+1.05);};
 return {seq,all,anim,move,fade,enter,exit,pulse,flight,pose};
}
