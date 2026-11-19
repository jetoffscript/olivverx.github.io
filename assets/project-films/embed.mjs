// A small same-origin bridge for the reading preview; standalone players are unchanged.
export function installEmbed({play,pause,seek,time,playing,duration}){
 if(new URLSearchParams(location.search).get('embed')!=='1')return;
 document.documentElement.classList.add('embedded-film');
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./embed.css',import.meta.url).href;document.head.append(css);
 const slider=document.querySelector('.scrubber');
 const progress=()=>slider.style.setProperty('--progress',`${100*Number(slider.value)/Number(slider.max)}%`);
 new MutationObserver(progress).observe(document.querySelector('.film'),{attributes:true,attributeFilter:['data-time']});progress();
 document.querySelector('.fullscreen').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/></svg>';
 if (new URLSearchParams(location.search).has('panel')) {
  const button = document.querySelector('.fullscreen');
  function label(expanded) {
   button.title = expanded ? '返回阅读' : '在弹窗内放大';
   button.setAttribute('aria-label', button.title);
   button.setAttribute('aria-pressed', String(expanded));
   button.querySelector('path').setAttribute('d', expanded
    ? 'M4 8h4V4m8 0v4h4M8 20v-4H4m16 0h-4v4'
    : 'M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4');
  }
  label(false);
  button.addEventListener('click', event => {
   event.stopImmediatePropagation();
   parent.postMessage({type:'jet-film-toggle-panel'}, location.origin);
  }, true);
  window.addEventListener('message', event => {
   if (event.source === parent && event.origin === location.origin && event.data?.type === 'jet-film-panel')
    label(event.data.expanded);
  });
 }
 const report=()=>parent.postMessage({type:'jet-film-state',time:time(),playing:playing(),ended:time()>=duration-.04},location.origin);
 window.addEventListener('message',e=>{
  if(e.source!==parent||e.origin!==location.origin)return;
  if(e.data?.type==='jet-film-theme'){document.documentElement.dataset.theme=e.data.theme==='dark'?'dark':'light';return}
  if(e.data?.type!=='jet-film-command')return;
  const {command,value}=e.data;
  if(command==='play')play();else if(command==='pause')pause();else if(command==='seek'&&Number.isFinite(value))seek(value);
  report();
 });
 document.addEventListener('click',e=>{if(e.target.closest('.play-toggle,.replay,.start-overlay'))requestAnimationFrame(()=>{parent.postMessage({type:'jet-film-manual'},location.origin);report()})});
 document.addEventListener('keydown',e=>{if(e.code==='Escape'&&!document.fullscreenElement){e.preventDefault();parent.postMessage({type:'jet-film-escape'},location.origin)}if(e.code==='Space')requestAnimationFrame(()=>{parent.postMessage({type:'jet-film-manual'},location.origin);report()})});
 document.addEventListener('input',e=>{if(e.target.matches('.scrubber')){parent.postMessage({type:'jet-film-manual'},location.origin);report()}});
 document.addEventListener('fullscreenchange',()=>parent.postMessage({type:'jet-film-fullscreen',active:!!document.fullscreenElement},location.origin));
 parent.postMessage({type:'jet-film-ready'},location.origin);
}
