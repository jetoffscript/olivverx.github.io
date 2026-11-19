import {installEmbed} from './embed.mjs?v=bounded';
import {films} from './catalog.mjs';
const $=s=>document.querySelector(s),film=$('.film'),stage=$('.stage'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const id=new URLSearchParams(location.search).get('film')||'edit',meta=films.find(f=>f.id===id&&f.module)||films[1];
const {default:scene}=await import(meta.module + "?v=films-final");document.title=`${meta.project} · ${meta.name}`;
stage.innerHTML=scene.html;stage.classList.add(`scene-${meta.id}`);$('.film-name').textContent=meta.name;
const next=films[films.indexOf(meta)+1];if(next){$('.next-film').href=`player.html?film=${next.id}&autoplay=1`;}else{$('.next-film').textContent='返回目录';}
$('.chapters').innerHTML=scene.chapters.map(([t,label])=>`<button data-time="${t}">${label}</button>`).join('');
const duration=scene.duration;$('.scrubber').max=duration;
let timeline,playing=false,resume=false,frame=0,resizeTimer,lastPaint=-1;
const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function ui(){const t=Math.min(duration,Math.max(0,timeline?.time||0));film.dataset.time=t.toFixed(2);film.dataset.playing=String(playing);$('.scrubber').value=t;$('.time').textContent=`${format(t)} / ${format(duration)}`;$('.play-toggle').textContent=playing?'Ⅱ':'▶';$('.play-toggle').setAttribute('aria-label',playing?'暂停':'播放');let chapter=0;scene.chapters.forEach(([at],i)=>{if(t>=at)chapter=i});document.querySelectorAll('.chapters button').forEach((b,i)=>b.setAttribute('aria-current',String(i===chapter)));}
function build(){const time=timeline?.time||0;timeline?.cancel();const compact=film.clientWidth < film.clientHeight * 1.25;const w=compact?860:1160,h=compact?1000:720;Object.assign(stage.style,{width:w+'px',height:h+'px',marginLeft:-w/2+'px',marginTop:-h/2+'px'});stage.style.setProperty('--fit',Math.min(film.clientWidth/w,film.clientHeight/h));stage.classList.toggle('compact',compact);const seq=scene.build(stage,compact);seq.push([{t:0},{t:[0,duration]},{at:0,duration,ease:'linear'}]);timeline=window.Motion.animate(seq,{autoplay:false});timeline.pause();timeline.time=Math.min(time,duration);if(playing)timeline.play();ui();}
function watch(){frame=0;if(!playing)return;const t=timeline.time;if(t>=duration-.035){timeline.pause();timeline.time=duration;playing=false;ui();$('.sr-only').textContent='动画播放结束';return}if(Math.abs(t-lastPaint)>.075){ui();lastPaint=t}frame=requestAnimationFrame(watch)}
function pause(){playing=false;timeline.pause();cancelAnimationFrame(frame);frame=0;ui()}
function play(){if(timeline.time>=duration-.035)timeline.time=0;$('.start-overlay').hidden=true;playing=true;timeline.play();ui();if(!frame)frame=requestAnimationFrame(watch)}
function seek(t){pause();timeline.time=Math.max(0,Math.min(duration,t));$('.start-overlay').hidden=true;ui()}
try{build();}catch(error){$('.sr-only').textContent='动画加载失败';throw error}
$('.play-toggle').onclick=()=>playing?pause():play();$('.start-overlay').onclick=play;$('.replay').onclick=()=>{seek(0);play()};$('.scrubber').oninput=e=>seek(Number(e.target.value));document.querySelectorAll('.chapters button').forEach(b=>b.onclick=()=>seek(Number(b.dataset.time)));
film.onkeydown=e=>{if(e.target!==film)return;if(e.code==='Space'){e.preventDefault();playing?pause():play()}if(e.code==='ArrowRight'||e.code==='ArrowLeft'){e.preventDefault();seek(timeline.time+(e.code==='ArrowRight'?2:-2))}};
if (!new URLSearchParams(location.search).has('panel')) $('.fullscreen').onclick=async()=>{try{document.fullscreenElement?await document.exitFullscreen():await $('.film-shell').requestFullscreen()}catch{$('.sr-only').textContent='当前浏览器不支持全屏'}};
new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(build,100)}).observe(film);
document.addEventListener('visibilitychange',()=>{if(document.hidden){resume=playing;pause()}else if(resume){resume=false;play()}});reduced.addEventListener('change',()=>{if(reduced.matches)pause()});
await document.fonts.ready;document.body.dataset.ready='true';if(new URLSearchParams(location.search).get('autoplay')==='1'&&!reduced.matches){if(document.hidden)resume=true;else play()}

installEmbed({play,pause,seek,time:()=>timeline.time,playing:()=>playing,duration});
