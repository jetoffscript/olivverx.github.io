import {installEmbed} from '../project-films/embed.mjs?v=bounded';
const motion=window.Motion;
const film=document.querySelector('.film'),stage=document.querySelector('.stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const duration=29;
const chapters=[{at:0,label:'研究发起者提出问题'},{at:4.8,label:'从问题生成四份研究材料'},{at:8.8,label:'画像圈定候选受访者'},{at:13.2,label:'问卷筛选符合条件的受访者'},{at:18,label:'招募计划安排访谈'},{at:22.6,label:'访谈大纲支持研究发起者与受访者交流'}];
const $=s=>document.querySelector(s);
const toggle=$('.play-toggle'),scrubber=$('.scrubber'),overlay=$('.start-overlay');
let timeline,playing=false,resumeAfterVisibility=false,updateFrame=0,lastUi=-1,resizeTimer;
const curve=[.22,1,.36,1],cross=[.65,0,.35,1];
function pose(x,y,s=1,r=0){return `translate3d(${x}px,${y}px,0) scale(${s}) rotate(${r}deg)`;}
function build(){
 const oldTime=timeline?.time||0,wasPlaying=playing;timeline?.cancel();
 const compact=film.clientWidth < film.clientHeight * 1.25,w=compact?780:1160,h=compact?940:700;
 stage.classList.toggle('compact',compact);
 Object.assign(stage.style,{width:`${w}px`,height:`${h}px`,marginLeft:`${-w/2}px`,marginTop:`${-h/2}px`});
 stage.style.setProperty('--fit',Math.min(film.clientWidth/w,film.clientHeight/h));
 const seq=[];
 const move=(el,from,to,at,d=1,ease=curve)=>seq.push([el,{transform:[from,to]},{at,duration:d,ease}]);
 const fade=(el,from,to,at,d=.5)=>seq.push([el,{opacity:[from,to]},{at,duration:d,ease:'linear'}]);
 const pop=(el,at,x=0,y=0,s=1)=>{fade(el,0,1,at,.5);move(el,pose(x,y+22,s*.8),pose(x,y,s),at,.9);};
 const client=$('.client'),question=$('.question'),seed=$('.seed');
 const cards=['persona','survey','recruit','outline'].map(n=>$(`.${n}-seat`));
 const people=[...document.querySelectorAll('.candidate')];
 const cx=compact?-240:-440,cy=compact?-330:0;
 pop(client,.1,compact?-230:-350,compact?-90:0,1.12);
 pop(question,.45,compact?60:65,compact?-90:0,compact?.8:1);
 move(client,pose(compact?-230:-350,compact?-90:0,1.12),pose(cx,cy,.9),3.1,1.2);
 // A press commits the question; the four documents inherit the outgoing motion.
 seq.push([$('.send-mark'),{scale:[1,.83,1],y:[0,2,0]},{at:2.65,duration:.5,ease:curve}]);
 pop($('.client-label'),3.7,cx,cy+85);
 move(question,pose(compact?60:65,compact?-90:0,compact?.8:1),pose(0,0,.12),3.2,1.15,cross);fade(question,1,0,3.8,.5);
 pop(seed,3.9,0,0);
 move(seed,pose(0,0),pose(0,0,.2,180),4.6,1.2);fade(seed,1,0,5.2,.5);
 const spread=compact?[pose(-167,-130,.9,-5),pose(167,-130,.9,4),pose(-167,210,.9,-3),pose(167,210,.9,5)]:[pose(-270,-65,.77,-9),pose(-90,-20,.85,-3),pose(90,25,.85,3),pose(270,70,.77,9)];
 cards.forEach((el,i)=>{fade(el,0,1,4.7+i*.16,.6);move(el,pose(0,0,.08,(i-1.5)*10),spread[i],4.7+i*.16,1.45);});
 const orbit=$('.orbit-one');fade(orbit,0,.7,4.1,.5);move(orbit,pose(0,0,.1),pose(0,0,2.4),4.1,2);fade(orbit,.7,0,5.1,1);
 // Each material stays in the scene; focusing it changes how it acts on people.
 const focus=compact?pose(-80,5,1.06):pose(-65,0,1.13);
 const dock=i=>compact?pose(-220+i*145,355,.36,(i-1.5)*3):pose(-250+i*165,255,.36,(i-1.5)*3);
 cards.forEach((el,i)=>{move(el,spread[i],i===0?focus:dock(i),8.5,1.2);if(i)fade(el,1,.55,8.5,.7);});
 const positions=compact?[[240,-160],[270,-20],[240,120],[145,-245],[280,265]]:[[410,-165],[435,-50],[410,80],[305,-250],[450,205]];
 people.forEach((el,i)=>pop(el,9+i*.16,...positions[i],.65));
 pop($('.audience-label'),9.6,compact?240:410,compact?-255:-320);
 const halo=$('.selection-halo');pop(halo,10,compact?250:420,compact?-20:-30,compact?.87:1);
 move($('.scan-ring'),pose(0,0,.85),pose(0,0,1.2),10,1.5);fade($('.scan-ring'),0,1,10,.3);fade($('.scan-ring'),1,0,11.2,.6);
 [3,4].forEach(i=>{fade(people[i],1,.18,11.2,.7);move(people[i],pose(...positions[i],.65),pose(positions[i][0]+30,positions[i][1],.55),11.2,1);});
 fade(halo,1,0,12.7,.5);
 move(cards[0],focus,dock(0),13,1.1);fade(cards[0],1,.55,13,.5);
 move(cards[1],dock(1),focus,13,1.1);fade(cards[1],.55,1,13,.5);
 // Persona criteria carry into the questionnaire, rather than a disconnected page swap.
 document.querySelectorAll('.criterion-transfer').forEach((el,i)=>{
 const x=compact?-220:-250,y=compact?355:255;
 pop(el,13.6+i*.18,x,y-12,.9);
 move(el,pose(x,y-12,.9),pose(compact?-115:-100,-50+i*110,1),13.9+i*.18,1.1);
 fade(el,1,0,14.6+i*.18,.4);
 });
 document.querySelectorAll('.option em').forEach((el,i)=>{pop(el,14.2+i*.55);});
 seq.push([$('.form-progress i'),{scaleX:[0,1]},{at:14.1,duration:2.5,ease:curve}]);
 const responses=[$('.response-one'),$('.response-two')];
 [0,2].forEach((i,j)=>{
 const x=positions[i][0]-70,y=positions[i][1];
 pop(responses[j],14.5+j*.7,x,y,.65);move(responses[j],pose(x,y,.65),pose(compact?70:100,j?70:-55,.45),15.4+j*.6,1.2);fade(responses[j],1,0,16.1+j*.6,.55);
 pop(people[i].querySelector('.human-check'),16+j*.5);
 });
 fade(people[1],1,.18,16.5,.6);
 move(cards[1],focus,dock(1),18,1.1);fade(cards[1],1,.55,18,.5);
 move(cards[2],dock(2),focus,18,1.1);fade(cards[2],.55,1,18,.5);
 fade($('.audience-label'),1,0,18,.4);
 pop($('.selected-label'),18.7,compact?250:415,compact?-180:-190);
 [0,2].forEach((i,j)=>move(people[i],pose(...positions[i],.65),pose(compact?250:415,j?95:-80,.9),18.4,1.2));
 [1,3,4].forEach(i=>fade(people[i],.18,0,18.4,.6));
 document.querySelectorAll('.day.booked').forEach((el,i)=>seq.push([el,{backgroundColor:['#edf1e9','#14584a'],color:['#87958c','#ffffff']},{at:19.4+i*.35,duration:.5}]));
 document.querySelectorAll('.day.booked').forEach((day,i)=>{
  seq.push([day,{scale:[1,1.16,1],boxShadow:['0 0 0 0px #448b6733','0 0 0 4px #448b6720','0 0 0 7px #448b6700']},{at:19.4+i*.35,duration:.62,ease:curve}]);
 });
 pop($('.booking b'),20.2);move($('.booking'),pose(0,20),pose(0,0),19.6,1);
 move(cards[2],focus,dock(2),22.4,1.1);fade(cards[2],1,.55,22.4,.5);
 const outlineFocus=compact?pose(0,130,.85):pose(0,5,.95);
 move(cards[3],dock(3),outlineFocus,22.4,1.1);fade(cards[3],.55,1,22.4,.5);
 const chatY=compact?-150:-70,clientEnd=compact?pose(-225,-150,1):pose(-365,-70,1),guestEnd=compact?pose(225,-150,1):pose(365,-70,1);
 move(client,pose(cx,cy,.9),clientEnd,22.6,1.2);
 move($('.client-label'),pose(cx,cy+85),pose(compact?-225:-365,chatY+90),22.6,1.2);
 move(people[0],pose(compact?250:415,-80,.9),guestEnd,22.6,1.2);
 fade(people[2],1,0,22.6,.6);move($('.selected-label'),pose(compact?250:415,compact?-180:-190),pose(compact?225:365,chatY+90),22.6,1.2);
 // Conversation is visibly anchored to both people, with the outline between them.
 pop($('.chat-left'),23.7,compact?-145:-210,chatY-100,.85);
 pop($('.chat-right'),24.7,compact?145:210,chatY-100,.85);
 document.querySelectorAll('.chat i').forEach((el,i)=>{
 const at=24+(i>6?.7:0)+i%7*.09;
 seq.push([el,{scaleY:[.35,1,.45,.85,.35,1,.5]},{at,duration:3.5,ease:'easeInOut'}]);
 });
 document.querySelectorAll('.topic').forEach((el,i)=>seq.push([el,{backgroundColor:['#ffffff00','#e4f2e9','#ffffff00']},{at:24+i*.9,duration:1.4}]));
 pop($('.shared-check'),27,0,compact?-190:-210,.8);
 const clock={time:0};seq.push([clock,{time:[0,duration]},{at:0,duration,ease:'linear'}]);
 timeline=motion.animate(seq,{autoplay:false});timeline.pause();timeline.time=Math.max(0,Math.min(oldTime,duration));
 if(wasPlaying){timeline.play();playing=true;}updateUi();
}
function updateUi(){
 const t=Math.max(0,Math.min(duration,timeline?.time||0));
 scrubber.value=t;
 $('.time').textContent=`00:${String(Math.floor(t)).padStart(2,'0')} / 00:29`;
 toggle.setAttribute('aria-label',playing?'暂停动画':t>=duration?'重新播放动画':'播放动画');
 toggle.innerHTML=playing?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>';
 let index=0;for(let i=0;i<chapters.length;i++)if(t>=chapters[i].at)index=i;
 $('.film-caption').textContent=t<3.5?'':chapters[index].label;
 document.querySelectorAll('.chapters [data-time]').forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));
 film.dataset.time=t.toFixed(2);film.dataset.playing=String(playing);
}
function watch(){updateFrame=0;if(!playing)return;const now=timeline.time;if(now>=duration-.04){timeline.pause();timeline.time=duration;playing=false;updateUi();$('.sr-only').textContent='动画播放结束。研究发起者通过画像、问卷和招募计划找到受访者，并以访谈大纲展开交流。';return;}if(Math.abs(now-lastUi)>.08){updateUi();lastUi=now;}updateFrame=requestAnimationFrame(watch);}
function pause(){playing=false;timeline.pause();cancelAnimationFrame(updateFrame);updateFrame=0;updateUi();}
function play(){if(timeline.time>=duration-.04)timeline.time=0;overlay.hidden=true;playing=true;timeline.play();updateUi();if(!updateFrame)updateFrame=requestAnimationFrame(watch);}
function seek(time){pause();timeline.time=Math.max(0,Math.min(duration,time));overlay.hidden=true;updateUi();}
if(!motion?.animate){$('.sample-note').textContent='动画依赖未加载，请刷新页面重试。';overlay.hidden=true;throw new Error('Motion failed to load');}
build();
toggle.addEventListener('click',()=>playing?pause():play());overlay.addEventListener('click',play);
$('.replay').addEventListener('click',()=>{seek(0);play();});
scrubber.addEventListener('input',e=>seek(Number(e.target.value)));
document.querySelectorAll('.chapters [data-time]').forEach(button=>button.addEventListener('click',()=>seek(Number(button.dataset.time))));
film.addEventListener('keydown',e=>{if(e.target!==film)return;if(e.code==='Space'){e.preventDefault();playing?pause():play();}else if(e.code==='ArrowRight'){e.preventDefault();seek(timeline.time+2);}else if(e.code==='ArrowLeft'){e.preventDefault();seek(timeline.time-2);}});
if (!new URLSearchParams(location.search).has('panel')) $('.fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.film-shell').requestFullscreen();}catch{$('.sample-note').textContent='当前浏览器不支持全屏，可使用页面缩放观看。';}});
new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,100);}).observe(film);
document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeAfterVisibility=playing;pause();}else if(resumeAfterVisibility){resumeAfterVisibility=false;play();}});
reduced.addEventListener('change',()=>{if(reduced.matches)pause();});
document.fonts.ready.then(()=>{document.body.dataset.ready='true';if(new URLSearchParams(location.search).get('autoplay')==='1'&&!reduced.matches){if(document.hidden)resumeAfterVisibility=true;else play();}});

installEmbed({play,pause,seek,time:()=>timeline.time,playing:()=>playing,duration});
