// Project detail dialogs enhance the existing readable <details> content.
export function initProjectDialog({onClose}={}) {
 const filmIds={onboarding:['question','edit','replay'],gameplayer:['observe','orchestrate','feedback','playbook']};
 const asset=new URL('./',import.meta.url);
 const dialog=document.createElement('dialog');dialog.className='jet-reading';dialog.setAttribute('aria-labelledby','jet-reading-title');
 dialog.innerHTML='<header class="jet-reading__bar"><span class="jet-reading__name"></span><button class="jet-reading__close" aria-label="关闭项目详情" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div class="jet-reading__scroll"><article class="jet-reading__article"><header class="jet-reading__intro"><p class="jet-reading__credit"></p><h1 id="jet-reading-title"></h1></header><div class="jet-reading__sections"></div><footer><button class="jet-reading__finish">返回作品</button></footer></article></div>';
 document.body.append(dialog);
 const $=s=>dialog.querySelector(s),scroller=$('.jet-reading__scroll');
 let records=[],observer,current=null,trigger=null,suppressClose=false,oldOverflow='',closeAnimation=null;
 function send(r,command,value){if(!r.ready){r.pending=command==='play';return}r.frame.contentWindow.postMessage({type:'jet-film-command',command,value},location.origin)}
 function theme(r){if(r.ready)r.frame.contentWindow.postMessage({type:'jet-film-theme',theme:document.documentElement.dataset.theme||'light'},location.origin)}
 function ensure(r){if(r.frame)return;const f=document.createElement('iframe');r.frame=f;f.title=r.title;f.allow="fullscreen 'none'";f.src=new URL(r.id==='question'?'research-film/?embed=1&panel=1&v=films-final':`project-films/player.html?film=${r.id}&embed=1&panel=1&v=films-final`,asset).href;r.el.prepend(f)}
 function start(r){ensure(r);records.forEach(other=>{if(other!==r)send(other,'pause')});r.poster.hidden=true;send(r,'play')}
 function pauseAll(){records.forEach(r=>send(r,'pause'))}
 let expanded = null;
 function expand(record) {
  const previous = expanded;
  expanded = record;
  for (const item of [previous, record].filter(Boolean)) {
   item.fullscreen = item === record;
   item.el.classList.toggle('is-expanded', item.fullscreen);
   item.frame.contentWindow.postMessage({type:'jet-film-panel', expanded:item.fullscreen}, location.origin);
  }
  dialog.classList.toggle('has-expanded-film', Boolean(record));
  for (const control of scroller.querySelectorAll('button, a, iframe')) {
   control.inert = Boolean(record && control !== record.frame);
  }
 }
 function dismiss() {
  if (expanded) expand(null);
  else close();
 }
 function open(slug,source){
  const detail=document.querySelector(`details[data-project="${slug}"]`);if(!detail)return;
  if(dialog.open&&current===slug)return;
  closeAnimation?.cancel();closeAnimation=null;
  if (expanded) expand(null);
  observer?.disconnect();pauseAll();current=slug;trigger=source||detail.querySelector('summary');detail.open=false;
  const heading = detail.closest('.jet-project').querySelector('.jet-project__heading');
  const projectName = heading.querySelector('h3').textContent;
  $('.jet-reading__name').textContent = projectName;
  $('#jet-reading-title').textContent = projectName;
  $('.jet-reading__credit').textContent = heading.querySelector('p').textContent;
  const sections=$('.jet-reading__sections');sections.replaceChildren();let section,index=0;
  for(const node of detail.querySelector('.jet-project__body').children){
   if (node.tagName === 'H4') {
    section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.dataset.step = String(++index).padStart(2, '0');
    heading.textContent = node.textContent;
    section.append(heading);
    sections.append(section);
   } else if (section) section.append(node.cloneNode(true));
  }
  // The approved narrative explicitly separates planning, execution and verification.
  if(slug==='gameplayer'){
   const s=sections.children[1];s.querySelector('h2').textContent='拆解用例，分工执行与查验';
   s.querySelector('p').textContent='规划 Agent 将一句测试用例拆成可执行的子目标，执行 Agent 根据子目标操作游戏界面，再由独立的 Agent 查验结果。不同角色获得各自需要的领域知识，让规划、操作和判断各有依据。';
  }
  records=[];
  [...sections.children].forEach((s,i)=>{const id=filmIds[slug]?.[i];if(!id)return;const el=document.createElement('figure');el.className='jet-reading__media';el.dataset.film=id;const poster=document.createElement('button');poster.className='jet-reading__poster';poster.setAttribute('aria-label',`播放：${s.querySelector('h2').textContent}`);const img=document.createElement('img');img.src=new URL(`project-films/thumbnails/${id}.png?v=films-final`,asset).href;img.alt='';img.loading='lazy';const play=document.createElement('span');play.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>';poster.append(img,play);el.append(poster);s.append(el);const r={id,el,poster,title:s.querySelector('h2').textContent,ready:false,pending:false,ratio:0,fullscreen:false};records.push(r);poster.onclick=()=>start(r)});
  if(!dialog.open){oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)dialog.animate([{opacity:0,transform:'translateY(10px) scale(.99)'},{opacity:1,transform:'none'}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'})}
  scroller.scrollTop=0;$('.jet-reading__close').focus({preventScroll:true});
  observer=new IntersectionObserver(entries=>{for(const e of entries){const r=records.find(r=>r.el===e.target);if(!r)continue;r.ratio=e.intersectionRatio;if(e.isIntersecting)ensure(r);if(r.ratio<.15&&!r.fullscreen)send(r,'pause')}},{root:scroller,threshold:[0,.15]});records.forEach(r=>observer.observe(r.el));
 }
 function close({route=false}={}){
  if(!dialog.open)return;
  if (expanded) expand(null);
  pauseAll();suppressClose=route;
  closeAnimation?.cancel();closeAnimation=null;
  if(route||matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.close();return}
  closeAnimation=dialog.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(6px) scale(.995)'}],{duration:140,easing:'ease-out'});closeAnimation.finished.then(()=>{closeAnimation=null;dialog.close()}).catch(()=>{});
 }
 dialog.addEventListener('cancel',e=>{e.preventDefault();dismiss()});$('.jet-reading__close').onclick=()=>close();$('.jet-reading__finish').onclick=()=>close();
 dialog.addEventListener('close',()=>{pauseAll();observer?.disconnect();document.documentElement.style.overflow=oldOverflow;current=null;trigger?.focus({preventScroll:true});if(!suppressClose)onClose?.();suppressClose=false});
 let downOutside=false;const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom};dialog.addEventListener('pointerdown',e=>downOutside=outside(e));dialog.addEventListener('pointerup',e=>{if(downOutside&&outside(e))close();downOutside=false});
 window.addEventListener('message',e=>{if(e.origin!==location.origin)return;const r=records.find(r=>r.frame?.contentWindow===e.source);if(!r)return;
  if(e.data?.type==='jet-film-ready'){r.ready=true;theme(r);if(r.pending&&dialog.open)send(r,'play')}
  if(e.data?.type==='jet-film-state'){r.pending=false;if(e.data.playing)records.forEach(other=>{if(other!==r)send(other,'pause')})}
  if(e.data?.type==='jet-film-fullscreen'){r.fullscreen=e.data.active;if(!r.fullscreen&&r.ratio<.15)send(r,'pause')}
  if(e.data?.type==='jet-film-toggle-panel' && dialog.open) expand(expanded === r ? null : r);
  if(e.data?.type==='jet-film-escape')dismiss();
 });
 new MutationObserver(()=>records.forEach(theme)).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAll()});
 return {open,close,get isOpen(){return dialog.open}};
}
