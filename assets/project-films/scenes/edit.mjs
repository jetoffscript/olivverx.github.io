import {profile,survey,paper,lines,badge,icon} from '../art.mjs';
import {composer,pose} from '../timeline.mjs';
export default {
 duration:27,
 chapters:[[0,'直接改写'],[6.5,'读取当前状态'],[11.5,'遵循产物定义'],[17,'关联更新'],[25,'一致的产物']],
 html:`${profile()}${survey()}${paper('definition','产物定义','layers',`<div class="proof-sweep" aria-hidden="true"></div><div class="schema-slot slot-a"></div><div class="schema-slot slot-b"></div><div class="schema-slot slot-c"></div><div class="schema-lock">${icon('lock')}</div>`)}
 <div class="object edit-request">修改条件 1 <span>↗</span></div><div class="object raw-fragment"><i></i><i></i><i></i></div><div class="object state-cross failure">×</div><div class="object state-cross stale">!</div><div class="object label error-label">文字改了，结构和关联未更新</div>
 ${badge('read-state','读取当前产物','eye')}${badge('version','当前状态','layers')}
 <div class="object structured-chip"><i></i><span>✓</span></div><div class="object field-glow"></div><svg class="sync-trajectory" aria-hidden="true"><g class="to-survey"><path/><circle r="5"/></g><g class="to-outline"><path/><circle r="5"/></g></svg>
 ${paper('outline-mini','访谈大纲','chat',`<div class="mini-topic">访谈内容 1${lines(2)}</div><div class="mini-topic">访谈内容 2${lines(2)}</div><div class="updated-band">${icon('check')} 已同步</div>`)}
 <div class="object seal done-profile">${icon('check')}</div><div class="object seal done-survey">${icon('check')}</div><div class="object seal done-outline">${icon('check')}</div>`,
 build(root,m){
 const c=composer(root),{enter,move,fade,exit,anim,seq}=c;
 const a=m?[-185,-70,.95]:[-240,25,1.08],b=m?[185,65,.9]:[240,25,1.08];
 enter('.profile',0,...a);enter('.survey',.2,...b);enter('.edit-request',.5,0,m?-360:-260);
 enter('.raw-fragment',1.8,0,m?-275:-190);move('.raw-fragment',pose(0,m?-275:-190),pose(a[0],a[1]+5,1.4,8),2.2,1.1);
 anim('.profile .field-a',{borderColor:['#e0e7db','#c68c77'],backgroundColor:['#ffffff00','#f6e7db']},3.2,.6);
 enter('.failure',3.4,a[0]+115,a[1]+10);enter('.stale',3.7,b[0]+90,b[1]-25);
 enter('.error-label',4.2,0,m?340:285);exit('.raw-fragment',5.3);exit('.failure',5.5);exit('.stale',5.5);exit('.error-label',5.7);exit('.edit-request',5.7);
 anim('.profile .field-a',{borderColor:['#c68c77','#e0e7db'],backgroundColor:['#f6e7db','#ffffff00']},5.7,.6);
 const ph=m?pose(-70,-40,1.1):pose(-120,20,1.18),sh=m?pose(260,275,.55):pose(390,155,.6);
 move('.profile',pose(...a),ph,6.2,1.2);move('.survey',pose(...b),sh,6.2,1.2);fade('.survey',1,.55,6.2,.6);
 enter('.read-state',6.5,m?-75:-120,m?-340:-260);enter('.version',7.3,m?230:340,m?-100:-90,.8);
 anim('.profile .field-a',{backgroundColor:['#ffffff00','#dfefdf','#ffffff00']},7.5,1.5);
 anim('.profile .field-b',{backgroundColor:['#ffffff00','#dfefdf','#ffffff00']},8.1,1.5);
 exit('.read-state',10);exit('.version',10.2);
 enter('.definition',10.5,m?-70:-120,m?-40:20,m?1.18:1.26);
 // The definition is a translucent stencil, snapping to actual editable fields.
 anim('.definition',{opacity:[0,.9,.32] },10.5,2);
 anim('.proof-sweep',{opacity:[0,1,1,0],scaleY:[.1,1,1,.1],y:[0,30,178,202]},10.9,1.55,'linear');
 enter('.structured-chip',11.5,m?220:320,m?-250:-180);move('.structured-chip',pose(m?220:320,m?-250:-180),pose(m?-55:-105,m?-28:34,1.1),12.4,1.6);
 anim('.structured-chip',{borderRadius:['18px','6px']},12.6,1.2);
 exit('.structured-chip',14,.3);exit('.definition',14.5);
 // Replace the original field in place: never overlay a second value.
 anim('.profile .field-a>i',{opacity:[1,0]},13.55,.3);
 anim('.profile .field-a>i',{backgroundColor:['#c8ddce','#14584a'],width:['95px','125px']},13.9,.5);
 anim('.profile .field-a>i',{opacity:[0,1],transform:[pose(0,0,.7),pose()]},14.3,.7);
 enter('.field-glow',14.2,m?-70:-120,m?-30:34,m?1.1:1.18);exit('.field-glow',15.2);
 const finalA=m?pose(-200,-140,.86):pose(-355,0,.95),finalB=m?pose(200,-140,.86):pose(0,0,.95),finalO=m?pose(0,220,.86):pose(355,0,.95);
 move('.profile',ph,finalA,16,1.2);move('.survey',sh,finalB,16,1.2);fade('.survey',.55,1,16,.6);
 enter('.outline-mini',16.4,m?0:355,m?220:0,m?.86:.95);
 const from=m?[-180,-130]:[-335,10],to1=m?[190,-195]:[-5,-55],to2=m?[0,165]:[355,-60];
 // One moving highlight traces the actual dependency before the target rewrites.
 const overlay=root.querySelector('.sync-trajectory');
 overlay.setAttribute('viewBox',m?'-430 -500 860 1000':'-580 -360 1160 720');
 function relay(selector,to,at,lift){
  const group=overlay.querySelector(selector),line=group.querySelector('path'),tip=group.querySelector('circle');
  const [x,y]=from,[endX,endY]=to;
  line.setAttribute('d',`M ${x} ${y} C ${x+80} ${y-lift}, ${endX-85} ${endY-lift}, ${endX} ${endY}`);
  const length=line.getTotalLength(),points=Array.from({length:33},(_,i)=>line.getPointAtLength(length*i/32));
  line.style.strokeDasharray=String(length);
  anim(line,{strokeDashoffset:[length,0]},at,1.12,'linear');
  anim(tip,{transform:points.map(p=>`translate(${p.x}px,${p.y}px)`)},at,1.12,'linear');
  anim(group,{opacity:[0,1,1,0]},at,1.65);
 }
 relay('.to-survey',to1,17.8,55);
 relay('.to-outline',to2,20,m?50:210);
 anim('.survey .q-one',{backgroundColor:['#ffffff00','#dceedd','#ffffff00']},18.8,2);
 root.querySelectorAll('.survey .q-one .option-row>span').forEach((line,i)=>{
  anim(line,{scaleX:[1,0]},18.9+i*.1,.25);
  anim(line,{backgroundColor:['#dde7d9','#528466'],width:[i?'100px':'150px',i?'142px':'176px']},19.2+i*.1,.1);
  anim(line,{scaleX:[0,1]},19.35+i*.15,.7);
 });
 fade('.survey .updated-band',0,1,20,.6);
 anim('.outline-mini .mini-topic:nth-of-type(1)',{backgroundColor:['#ffffff00','#dceedd','#ffffff00']},21,2);
 // Erase, then draw each updated line; retain the new state after the pulse.
 root.querySelectorAll('.outline-mini .mini-topic:nth-of-type(1) .ink-lines i').forEach((line,i)=>{
  anim(line,{scaleX:[1,0]},21+i*.12,.3);
  anim(line,{backgroundColor:['#dfe8dd','#528466'],width:[i?'72%':'100%',i?'90%':'78%']},21.4+i*.12,.1);
  anim(line,{scaleX:[0,1]},21.55+i*.18,.8);
 });
 fade('.outline-mini .updated-band',0,1,22.8,.6);
 enter('.done-profile',23,m?-80:-225,m?-280:-160);enter('.done-survey',23.4,m?320:130,m?-280:-160);enter('.done-outline',23.8,m?120:485,m?80:-160);
 return seq;
 }
};
