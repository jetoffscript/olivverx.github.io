import {lobby,badge,icon,lines,cursor,ring} from '../art.mjs';import {composer,pose} from '../timeline.mjs';
export default {duration:31,chapters:[[0,'回顾执行'],[6,'提炼经验'],[12,'记录适用条件'],[18,'匹配新任务'],[24,'复用与反馈']],
html:`${lobby('shot-a')}${lobby('shot-b')}${lobby('shot-c')}${lobby('next-game')}
<div class="object trail-label label">一次完成的操作</div><div class="object shot-check check-a">✓</div><div class="object shot-check check-b">✓</div><div class="object shot-check check-c">✓</div>
<div class="object playbook"><div class="book-pages"><div class="book-left"><header>适用条件</header><div class="condition-mini"><div class="mini-window">${icon('person')}<i></i><i></i></div><span>大厅 · 资料入口</span></div><div class="condition-check">${icon('check')} 当前界面匹配</div></div><div class="book-right"><header>操作经验</header><div class="operation"><i>1</i>${icon('person')}<span></span></div><div class="operation"><i>2</i><b>✧</b><span></span></div><div class="operation"><i>3</i>${icon('check')}<span></span></div></div></div><div class="book-cover">${icon('book')}<strong>Playbook</strong><div></div></div></div>
<div class="object task-line new-task">为另一位用户更换头像框</div>${badge('match','匹配适用场景','eye')}${badge('reuse','复用操作经验','book')}
<div class="object memory-token token-one">${icon('person')}</div><div class="object memory-token token-two">✧</div><div class="object memory-token token-three">${icon('check')}</div>
${cursor()}${ring()}<div class="object reuse-check">${icon('check')}</div>`,
build(root,m){const c=composer(root),{enter,move,fade,exit,anim,seq}=c;const y=m?-100:-30,dx=m?270:350,ss=m?.29:.36;
 enter('.trail-label',.2,0,m?-280:-210);
 ['a','b','c'].forEach((k,i)=>{enter(`.shot-${k}`,.4+i*.5,(i-1)*dx,y,ss,i===0?-4:i===2?4:0);enter(`.check-${k}`,1.8+i*.5,(i-1)*dx,y+120,.85)});
 fade('.shot-b .profile-panel',0,1,.9,.1);fade('.shot-b .large-frame',0,1,1,.1);fade('.shot-c .avatar-frame',0,1,1.4,.1);
 exit('.trail-label',4.5);['a','b','c'].forEach((k,i)=>{move(`.shot-${k}`,pose((i-1)*dx,y,ss,i===0?-4:i===2?4:0),pose(0,30,.12,(i-1)*5),4.8+i*.15,1.2);exit(`.shot-${k}`,5.7+i*.15);exit(`.check-${k}`,4.8)});
 enter('.playbook',5.8,0,30,1);
 // The cover opens to reveal scope on the left and reusable actions on the right.
 anim('.book-cover',{transform:['perspective(1000px) rotateY(0deg)','perspective(1000px) rotateY(-105deg)'],opacity:[1,0]},8,1.6);
 anim('.book-pages',{opacity:[0,1]},8,.8);anim('.playbook',{transform:[pose(0,30),pose(0,30,1.22)]},8,1.6);
 [1,2,3].forEach((i)=>anim(`.operation:nth-child(${i+1})`,{opacity:[0,1],transform:[pose(20,0),pose()]},9+i*.5,.8));
 anim('.condition-mini',{opacity:[0,1],transform:[pose(0,20),pose()]},11.4,1);
 const bookDock=m?pose(0,260,.84):pose(-335,30,.75);
 move('.playbook',pose(0,30,1.22),bookDock,15,1.4);enter('.new-task',15.5,m?0:160,m?-420:-270,.95);
 const gx=m?0:190,gy=m?-140:25,gs=m?.8:.69;
 enter('.next-game',16.2,gx,gy,gs);root.querySelector('.next-game .player-name').innerHTML='Guest<span>Lv. 30</span>';root.querySelector('.next-game .game-avatar>span').textContent='G';root.querySelector('.next-game .large-avatar>span').textContent='G';
 enter('.match',17.3,m?0:190,m?105:265,.85);anim('.next-game .game-scan',{opacity:[0,1,1,0],transform:[pose(0,10),pose(0,10),pose(0,495),pose(0,495)]},18,2);
 fade('.condition-check',0,1,20,.6);exit('.match',20.5);enter('.reuse',21,m?0:190,m?105:265,.85);
 const source=m?[140,220]:[-230,5];c.flight('.token-one',21.3,source,[gx-397*gs,gy-214*gs]);
 fade('.next-game .profile-panel',0,1,22.6,.6);c.flight('.token-two',23,m?[140,280]:[-230,55],[gx,gy+30*gs]);fade('.next-game .large-frame',0,1,24.2,.6);
 c.flight('.token-three',24.4,m?[140,340]:[-230,105],[gx,gy+150*gs]);fade('.next-game .game-toast',0,1,25.6,.5);fade('.next-game .avatar-frame',0,1,25.7,.4);
 fade('.next-game .profile-panel',1,0,26.5,.5);exit('.next-game .game-toast',27.3);exit('.reuse',27.5);
 // Follow the active instruction on the page as it transfers to the new lobby.
 [21.3,23,24.4].forEach((at,i)=>{
  const row='.operation:nth-child('+(i+2)+')';
  anim(row,{backgroundColor:['#ffffff00','#dbeeda','#ffffff00']},at,1.55);
  anim(row+' >span',{scaleX:[1,.64,1],backgroundColor:['#d7e5d1','#438366','#d7e5d1']},at,.92);
 });
 anim('.next-game .save-frame',{scale:[1,.95,1]},25.5,.42);
 // Reuse still checks the observed result; it does not blindly replay coordinates.
 fade('.next-game .lobby-highlight',0,1,27.7,.6);enter('.reuse-check',28.5,gx, m?100:265);return seq;}}
