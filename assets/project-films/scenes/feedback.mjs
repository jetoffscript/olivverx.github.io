import {lobby,badge,cursor,ring,icon} from '../art.mjs';import {composer,pose} from '../timeline.mjs';
export default {duration:27,chapters:[[0,'观察当前界面'],[5,'定位目标'],[11,'执行点击'],[16,'界面变化'],[21,'重新观察']],
html:`${lobby('main-game')}${lobby('before-view')}${lobby('after-view')}${badge('observe-badge','观察','eye')}${badge('locate-badge','定位','layers')}${badge('act-badge','动作','play')}${badge('again-badge','再观察','eye')}${cursor()}${ring()}<div class="object target-reticle"><i></i><i></i><i></i><i></i></div><div class="object target-lens"><div class="lens-avatar">J</div><span>个人资料</span></div><div class="object frame-one label small-label">点击前</div><div class="object frame-two label small-label">点击后</div><div class="object change-mark">${icon('eye')}</div>`,
build(root,m){const c=composer(root),{enter,move,fade,exit,anim,seq}=c;
 const gy=m?-180:-70,gs=m?.88:.9,px=-397*gs,py=gy-214*gs;
 enter('.main-game',0,0,gy,gs);enter('.observe-badge',.4,0,m?-455:-325,.85);
 anim('.main-game .game-scan',{opacity:[0,1,1,0],transform:[pose(0,10),pose(0,10),pose(0,495),pose(0,495)]},1.3,2.3);
 exit('.observe-badge',4.2);enter('.locate-badge',4.5,0,m?-455:-325,.85);
 enter('.target-reticle',5,px,py,gs);anim('.target-reticle',{transform:[pose(px,py,gs*1.6),pose(px,py,gs)]},5,1.1);
 enter('.target-lens',6.2,m?200:350,m?190:195,1);exit('.target-lens',9.6);exit('.locate-badge',9.7);
 enter('.act-badge',10,0,m?-455:-325,.85);enter('.cursor',10.3,180,gy+110);move('.cursor',pose(180,gy+110),pose(px,py),10.5,1.4);
 enter('.click-ring',12,px,py,.25);move('.click-ring',pose(px,py,.25),pose(px,py,1.4),12,.8);exit('.click-ring',12.6);exit('.target-reticle',12.6);anim('.cursor',{transform:[pose(px,py),pose(px,py,.86),pose(px,py)]},12,.45);
 // The clicked avatar and the opened sheet share a spatial origin.
 anim('.main-game .game-avatar',{scale:[1,.91,1],boxShadow:['0 0 0 0px #b4f1d400','0 0 0 4px #b4f1d499','0 0 0 14px #b4f1d400']},12,.65);
 anim('.main-game .game-art',{transform:[pose(),pose(4,3,1.035)],filter:['brightness(1)','brightness(.68)']},12.65,.95);
 fade('.main-game .profile-panel',0,1,12.72,.5);
 anim('.main-game .profile-panel',{transform:[pose(-388,-202,.15),pose(0,0,1.014),pose()]},12.72,1.12);
 for(const [i,selector] of ['.panel-head','.large-avatar','.frame-choice','.save-frame'].entries()){
  const target='.main-game .profile-panel '+selector;
  anim(target,{opacity:[0,1],y:[9,0]},13.04+i*.105,.42);
 }
 exit('.cursor',14.7);exit('.act-badge',15);
 const thumbY=m?235:250,thumbScale=m?.34:.29;
 enter('.before-view',15.3,m?-220:-215,thumbY,thumbScale);enter('.frame-one',15.7,m?-220:-215,thumbY+80,.9);
 enter('.after-view',16,m?220:215,thumbY,thumbScale);fade('.after-view .profile-panel',0,1,16,.1);enter('.frame-two',16.4,m?220:215,thumbY+80,.9);
 enter('.again-badge',18,0,m?-455:-325,.85);anim('.main-game .game-scan',{opacity:[0,1,1,0],transform:[pose(0,10),pose(0,10),pose(0,495),pose(0,495)]},18.5,2.5);
 // The next target belongs to the newly observed dialog, not stale lobby coordinates.
 enter('.target-reticle',21,0,gy+30*gs,gs);anim('.main-game .chosen-frame',{borderColor:['#51717a','#b4f1d4'],boxShadow:['0 0 0 #b4f1d400','0 0 0 6px #b4f1d422']},21.6,.9);
 enter('.change-mark',22.5,0,thumbY);exit('.again-badge',25);return seq;}}
