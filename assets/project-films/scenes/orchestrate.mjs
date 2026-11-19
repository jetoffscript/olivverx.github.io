import {lobby,badge,cursor,ring,icon} from '../art.mjs';import {composer,pose} from '../timeline.mjs';
export default {duration:29,chapters:[[0,'一句测试用例'],[4,'规划子目标'],[10,'执行操作'],[23,'独立查验']],
html:`${lobby()}<div class="object task-line">更换头像框，并确认大厅展示</div>${badge('planner','规划 Agent','layers')}${badge('executor','执行 Agent','play')}${badge('verifier','查验 Agent','eye')}
<div class="object goal goal-one"><i>01</i><span>打开个人资料</span><b>✓</b></div><div class="object goal goal-two"><i>02</i><span>更换头像框</span><b>✓</b></div><div class="object goal goal-three"><i>03</i><span>返回大厅</span><b>✓</b></div>
${cursor()}${ring()}<div class="object verification"><header>${icon('eye')}结果查验</header><div><i class="verify-one">✓</i>头像框已更换</div><div><i class="verify-two">✓</i>大厅展示正确</div></div><div class="object verified-seal">${icon('check')}</div>`,
build(root,m){const c=composer(root),{enter,move,fade,exit,anim,seq}=c;
 const gx=0,gy=60,gs=.9;
 enter('.game',0,gx,gy,gs);enter('.task-line',.5,0,m?-350:-250);enter('.planner',1.5,0,m?-240:-160,.85);
 const goals=[[-280,m?-235:-235],[0,m?-235:-235],[280,m?-235:-235]];
 exit('.task-line',3.7);move('.planner',pose(0,m?-240:-160,.85),pose(m?0:-420,m?-355:-310,.8),3.8,1);
 goals.forEach(([x,y],i)=>{enter(['.goal-one','.goal-two','.goal-three'][i],4.2+i*.3,x,y,m?.88:1)});
 exit('.planner',8);enter('.executor',8.3,m?0:-420,m?-355:-310,.8);
 const px=-397*gs,py=gy-214*gs;enter('.cursor',9,100,gy+100);move('.cursor',pose(100,gy+100),pose(px,py),9.5,1.2);enter('.click-ring',10.6,px,py,.3);move('.click-ring',pose(px,py,.3),pose(px,py,1.2),10.6,.7);exit('.click-ring',11.1);
 fade('.profile-panel',0,1,11,.5);anim('.profile-panel',{transform:[pose(0,30,.95),pose()]},11,.8);fade('.goal-one b',0,1,11.8,.4);
 anim('.goal-one',{backgroundColor:['#fffefa','#e3f0e2','#fffefa']},9,3);
 move('.cursor',pose(px,py),pose(0,gy+40*gs),12,1.2);anim('.chosen-frame',{borderColor:['#51717a','#e8cd78'],backgroundColor:['#28515a','#5f7158']},13.3,.6);fade('.large-frame',0,1,13.5,.6);
 move('.cursor',pose(0,gy+40*gs),pose(0,gy+150*gs),14.6,1);fade('.game-toast',0,1,15.8,.4);fade('.goal-two b',0,1,16.2,.4);anim('.goal-two',{backgroundColor:['#fffefa','#e3f0e2','#fffefa']},12.2,4);fade('.avatar-frame',0,1,16.2,.4);
 move('.cursor',pose(0,gy+150*gs),pose(195*gs,gy-160*gs),17.4,1.1);fade('.profile-panel',1,0,18.6,.5);exit('.game-toast',19);fade('.goal-three b',0,1,19.4,.4);anim('.goal-three',{backgroundColor:['#fffefa','#e3f0e2','#fffefa']},17.4,2);exit('.cursor',20.2);exit('.executor',21);
 enter('.verifier',21.5,m?0:-420,m?-355:-310,.8);fade('.lobby-highlight',0,1,22.2,.6);
 enter('.verification',22.8,m?170:290,m?350:170,m?.9:1);fade('.verify-one',0,1,24,.4);fade('.verify-two',0,1,25,.4);
 // Each goal's progress strip ends on the matching execution acknowledgement.
 ['.goal-one','.goal-two','.goal-three'].forEach((selector,i)=>{
  const card=root.querySelector(selector);
  let strip=card.querySelector('.goal-progress');
  if(!strip){
   strip=document.createElement('span');
   strip.className='goal-progress';
   strip.setAttribute('aria-hidden','true');
   card.append(strip);
  }
  anim(strip,{scaleX:[0,1]},[9,12.2,17.4][i],[2.8,4,2][i],'linear');
 });
 anim('.verification header svg',{scale:[1,1.18,1]},23.35,.6);
 enter('.verified-seal',26.4,m?-265:-320,m?350:230);return seq;}}
