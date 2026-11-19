import {profile,context,icon,lines,badge,paper} from '../art.mjs';import {composer,pose} from '../timeline.mjs';
const snapshots=[0,1,2].map(i=>`<div class="object snapshot snapshot-${i}"><div class="snapshot-top"><span>0${i+1}</span><i></i></div><div class="snapshot-pair"><div>${icon('form')}${lines(2)}</div><div>${icon('chat')}${lines(2)}</div></div><span class="snapshot-check">✓</span></div>`).join('');
export default {duration:30,chapters:[[0,'现场丢失'],[7,'保存双份状态'],[15,'定位快照'],[21,'恢复与回放'],[28,'校验落库结果']],
html:`${profile('artifact')}${context()}${snapshots}<div class="object missing-state"><div>?</div><div>?</div></div><div class="object replay-track"><i></i><i></i><i></i></div><div class="object state-cross fault">!</div><div class="object label missing-label">产物状态？上下文？</div>${badge('restore','恢复现场','layers')}${badge('replay-badge','回放','play')}<div class="object replay-scan"></div><div class="object archive"><div class="archive-lid"></div><div class="archive-body">${icon('layers')}<span>已保存的产物</span></div><div class="archive-check">${icon('check')}</div></div><div class="object result-slip">${icon('form')}${lines(3)}</div>${badge('validate','结果校验','check')}<div class="object state-chip artifact-chip">${icon('form')}</div><div class="object state-chip context-chip">${icon('chat')}</div>`,
build(root,m){const c=composer(root),{enter,move,fade,exit,anim,seq}=c;
 const ax=m?-175:-210,bx=m?175:210,yy=m?-80:-40;
 enter('.artifact',0,ax,yy,.88);enter('.context',.2,bx,yy,.88);
 enter('.fault',1.5,0,m?185:190);fade('.artifact',1,.15,2.1,.7);fade('.context',1,.15,2.1,.7);
 enter('.missing-state',2.8,0,yy);enter('.missing-label',3.4,0,m?285:280);
 move('.missing-state',pose(0,yy),pose(-25,yy),4.2,.35);move('.missing-state',pose(-25,yy),pose(0,yy),4.55,.55);
 exit('.missing-state',5.6);exit('.missing-label',5.7);exit('.fault',5.7);
 fade('.artifact',.15,1,6.2,.6);fade('.context',.15,1,6.2,.6);
 const headY=m?-210:-145;
 move('.artifact',pose(ax,yy,.88),pose(ax,headY,.78),6.2,1.2);move('.context',pose(bx,yy,.88),pose(bx,headY,.78),6.2,1.2);
 const sy=m?120:150,dx=m?255:310;
 enter('.replay-track',7.2,0,sy, m?.8:1);
 for(let i=0;i<3;i++){
  const x=(i-1)*dx;enter(`.snapshot-${i}`,8+i*1.7,x,sy,m?.8:.9);
  anim(`.snapshot-${i} .snapshot-pair`,{opacity:[0,1]},8.5+i*1.7,.6);
  fade(`.snapshot-${i} .snapshot-check`,0,1,9+i*1.7,.4);
 }
 c.flight('.artifact-chip',7.8,[ax,headY+80],[ -dx-45,sy]);c.flight('.context-chip',8,[bx,headY+80],[-dx+45,sy]);
 anim('.artifact .field-a',{backgroundColor:['#ffffff00','#e0eedd','#ffffff00']},10,1.4);anim('.context .reply',{backgroundColor:['#d7e8db','#accfb7','#d7e8db']},10.4,1.4);
 enter('.fault',13.5,dx+80,sy-75);fade('.artifact',1,.22,14,.6);fade('.context',1,.22,14,.6);
 anim('.snapshot-1',{borderColor:['#cddbd0','#18805e'],boxShadow:['0 10px 24px #244c3415','0 0 0 6px #b4dfbf80']},15.5,.8);
 enter('.restore',16,0,m?0:25);
 // A paired snapshot is restored as two distinct sources, not a text-only replay.
 c.flight('.artifact-chip',17,[-45,sy],[ax,headY]);c.flight('.context-chip',17.2,[45,sy],[bx,headY]);
 fade('.artifact',.22,1,18,.8);fade('.context',.22,1,18,.8);exit('.fault',18.2);exit('.restore',19);
 enter('.replay-badge',20.2,0,m?0:25);
 enter('.replay-scan',20.8,-dx,sy);move('.replay-scan',pose(-dx,sy),pose(dx,sy),21,3,'linear');exit('.replay-scan',24.3);
 anim('.artifact .field-b',{backgroundColor:['#ffffff00','#d6ebd8','#ffffff00']},21.3,1.7);anim('.context .memory-bubble:last-child',{backgroundColor:['#e5eee1','#bddfc6','#e5eee1']},22,1.7);
 exit('.replay-badge',24.4);exit('.artifact',24.7);exit('.context',24.7);exit('.replay-track',24.7);[0,1,2].forEach(i=>exit(`.snapshot-${i}`,24.7));
 enter('.archive',25,0,20,1.3);enter('.result-slip',25.5,0,-190,.85);move('.result-slip',pose(0,-190,.85),pose(0,35,.65),26,1.2);exit('.result-slip',26.8);
 // Seal the archive only after the saved result has entered it.
 anim('.archive-lid',{transform:[pose(),pose(-4,-26,1,-4),pose(-4,-26,1,-4),pose(0,2),pose()]},25.55,1.88,'easeInOut');
 anim('.archive-body',{scaleY:[1,.976,1]},27.05,.46);
 enter('.validate',27.3,0,230);fade('.archive-check',0,1,28,.5);anim('.archive-check',{transform:[pose(0,0,.7),pose(0,0,1)]},28,.8);
 return seq;}}
