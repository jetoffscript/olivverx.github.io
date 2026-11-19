import {lobby,icon,badge} from '../art.mjs';import {composer,pose} from '../timeline.mjs';
const rows=Array.from({length:9},(_,i)=>`<div class="tree-row node-${i} ${[1,4,7].includes(i)?'actionable':'redundant'}"><i></i><span></span><b>${[1,4,7].includes(i)?['个人资料','英雄','开始对战'][[1,4,7].indexOf(i)]:''}</b><em></em></div>`).join('');
export default {duration:26,chapters:[[0,'图像与结构'],[6,'对应控件'],[11,'剪去冗余'],[17,'合并节点'],[23,'可执行观察']],
html:`${lobby()}<div class="object ui-tree"><header>${icon('layers')}<span>UI 结构</span></header><div class="tree-trunk"></div>${rows}</div><div class="object screen-label label small-label">游戏截图</div><div class="object prune-label label small-label">剪枝 · 合并</div><div class="object observation-pack"><div>${icon('eye')}<b>可执行观察</b></div><section><span>个人资料</span><span>英雄</span><span>开始对战</span></section></div><div class="object match-chip"></div><div class="object merge-piece piece-one"></div><div class="object merge-piece piece-two"></div>${badge('ready','定位到可操作控件','check')}`,
build(root,m){const c=composer(root),{enter,move,fade,exit,anim,seq}=c;const game=root.querySelector('.game');game.insertAdjacentHTML('beforeend','<div class="obs-box box-profile"></div><div class="obs-box box-hero"></div><div class="obs-box box-battle"></div>');
 // build() runs after a resize too: only one set of observation boxes is needed.
 game.querySelectorAll('.obs-box').forEach((el,i)=>{if(i>=3)el.remove()});
 const gx=m?0:-180,gy=m?-238:0,gs=m?.78:.82,tx=m?0:380,ty=m?211:0,ts=m?.95:1.06;
 enter('.game',0,gx,gy,gs);enter('.screen-label',.4,gx,gy-285*gs);enter('.ui-tree',1.1,tx,ty,ts);
 anim('.game-scan',{opacity:[0,1,1,0],transform:[pose(0,15),pose(0,15),pose(0,500),pose(0,500)]},2,2.5);
 const pairs=[['.box-profile','.node-1'],['.box-hero','.node-4'],['.box-battle','.node-7']];
 pairs.forEach(([box,row],i)=>{fade(box,0,1,5.2+i*1.5,.4);anim(row,{backgroundColor:['#ffffff00','#d9efdf','#ffffff00']},5.4+i*1.5,1.5);exit(box,6.4+i*1.5,.4)});
 pairs.forEach(([box,row],i)=>{
  const at=5.2+i*1.5;
  anim(box,{scale:[1.15,1],boxShadow:['0 0 0 5px #b4f1d400','0 0 0 1px #b4f1d466']},at,.52);
  anim(row+' >i',{scale:[1,1.65,1],backgroundColor:['#72a184','#176649','#72a184']},at+.28,.8);
 });
 enter('.prune-label',10.5,tx,m?455:260);
 const redundant=[0,2,3,5,6,8];redundant.forEach((i,j)=>{move(`.node-${i}`,pose(),pose(55,0,.85),11.3+j*.12,.8);fade(`.node-${i}`,1,0,11.3+j*.12,.65)});
 [1,4,7].forEach((i,j)=>move(`.node-${i}`,pose(),pose(0,-(i*36)+j*68+20),13,1.3));
 fade('.tree-trunk',1,0,12.5,.6);
 // Two decorative descendants resolve into the same actionable entry.
 enter('.piece-one',15.3,tx-70,ty+125,.8);enter('.piece-two',15.6,tx+70,ty+145,.8);
 move('.piece-one',pose(tx-70,ty+125,.8),pose(tx,ty-35,.35),16.4,1.3);move('.piece-two',pose(tx+70,ty+145,.8),pose(tx,ty-35,.35),16.6,1.3);exit('.piece-one',17.4);exit('.piece-two',17.6);
 anim('.node-4',{backgroundColor:['#ffffff00','#c8e6d0','#ffffff00']},17.5,1.8);
 exit('.ui-tree',19.2);exit('.prune-label',19.2);enter('.observation-pack',19.5,tx,ty, m?1.1:1);
 // The screenshot never changes; only the machine-facing representation is reduced.
 enter('.ready',23,tx,m?395:210,m?1:.9);fade('.box-profile',0,1,23,.6);fade('.box-hero',0,1,23.2,.6);fade('.box-battle',0,1,23.4,.6);
 return seq;}}
