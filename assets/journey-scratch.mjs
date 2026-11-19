const pulp = new Image();
pulp.src = new URL('./images/pulp.svg', import.meta.url).href;
const stories = [];

// Scale horizontally with the paragraph; keep the shoreline within one line.
const shores = [
  'M-5 3 C10 0 17 2 26 8 S40 18 51 10 S69 1 80 4 S96 7 105 2',
  'M-5 11 C8 17 16 14 27 6 S45 1 56 4 S73 10 86 5 S97 1 105 3',
  'M-5 4 C10 2 17 12 26 11 S41 0 54 3 S72 18 85 11 S97 4 105 6',
  'M-5 2 C11 8 21 1 33 3 S51 18 64 13 S79 2 92 4 S100 7 105 5',
  'M-5 10 C8 15 15 2 28 3 S46 12 60 6 S76 0 85 5 S97 16 105 11'
].map(top => new Path2D(top + ' L105 -20 L-5 -20 Z'));

function cutShore(ctx, width, height, index, cleared, columns, cell) {
  const mask = document.createElement('canvas');
  mask.width = Math.ceil(width);
  mask.height = Math.ceil(height);
  const ink = mask.getContext('2d');
  ink.fillRect(0, 0, mask.width, mask.height);
  ink.globalCompositeOperation = 'destination-out';
  ink.translate(0, 2);
  ink.scale(width / 100, 1);
  ink.filter = 'blur(3px)';
  ink.fill(shores[index % shores.length]);
  const pixels = ink.getImageData(0, 0, mask.width, mask.height);
  let seed = index + 1;
  cleared.fill(1);
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      const alpha = (y * mask.width + x) * 4 + 3;
      const coverage = pixels.data[alpha];
      if (!coverage) continue;
      // Dither the soft contour into individual grains, stable on repaint.
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed >>> 24;
      pixels.data[alpha] = coverage === 255 ? 255 : (noise < coverage ? 245 : 18);
      if (pixels.data[alpha] > 20) cleared[Math.floor(y/cell)*columns + Math.floor(x/cell)] = 0;
    }
  }
  ink.putImageData(pixels, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(mask, 0, 0, width, height);
  ctx.restore();
}

function mount(story, index) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const paragraph = story.querySelector('p');
  paragraph.id ||= 'memory-' + index;
  const reveal = document.createElement('button');
  reveal.type = 'button';
  reveal.textContent = '显示全文';
  reveal.setAttribute('aria-controls', paragraph.id);
  story.classList.add('scratch-story');
  canvas.setAttribute('aria-hidden', 'true');
  story.append(canvas, reveal);
  let width = 0, height = 0, previous;
  const strokes = [];
  let complete = false;

  const cell = 4;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dust = canvas.cloneNode();
  const air = dust.getContext('2d');
  story.insertBefore(dust, reveal);
  let columns, rows, cleared, pending = [], grains = [], frame = 0;
  let base = '#b1dfc9', texture = 'pulp', strength = .67, grainImage = pulp;
  let colors = ['#6d977f', '#95b49a', '#bed1ac', '#587e68'];

  function detach(tile, animate) {
    const { left, top, drift } = tile;
    ctx.clearRect(left, top, cell, cell);
    if (!animate || grains.length >= 1800) return;
    for (let i = 0; i < 2; i++) {
      grains.push({ x:left+Math.random()*cell, y:top+Math.random()*cell,
        vx:drift*(10+Math.random()*36), vy:-8-Math.random()*29,
        size:.7+Math.random()*1.35, age:0, life:.22+Math.random()*.27,
        color:colors[Math.floor(Math.random()*colors.length)] });
    }
  }
  let lastFrame = 0;
  function settle(now) {
    const dt = Math.min(.04,(now-lastFrame)/1000);
    lastFrame = now;
    pending = pending.filter(tile => {
      if (tile.at > now) return true;
      detach(tile,!reduced.matches);
      return false;
    });
    air.clearRect(0,0,width,height);
    grains = grains.filter(g => {
      g.age += dt;
      if (g.age >= g.life || reduced.matches) return false;
      g.x += g.vx*dt; g.y += g.vy*dt; g.vy += 280*dt;
      air.globalAlpha = Math.min(1, (1-g.age/g.life)*2);
      air.fillStyle = g.color;
      air.fillRect(g.x,g.y,g.size,g.size*.82);
      return true;
    });
    frame = pending.length || grains.length ? requestAnimationFrame(settle) : 0;
  }
  function erase(x,y,from,radius,animate=false) {
    const dx=x-(from?.x ?? x), dy=y-(from?.y ?? y);
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/(radius*.45)));
    const now=performance.now();
    for(let step=1;step<=steps;step++) {
      const cx=x-dx*(1-step/steps), cy=y-dy*(1-step/steps);
      for(let j=Math.max(0,Math.floor((cy-radius)/cell));j<Math.min(rows,(cy+radius)/cell);j++) {
        for(let i=Math.max(0,Math.floor((cx-radius)/cell));i<Math.min(columns,(cx+radius)/cell);i++) {
          const key=j*columns+i;
          if(cleared[key])continue;
          const ox=(i+.5)*cell-cx, oy=(j+.5)*cell-cy;
          const distance=Math.hypot(ox,oy)/radius;
          const edge=((i*73+j*157+i*j*13)%31)/31;
          if(distance>1-.1*edge)continue;
          cleared[key]=1;
          const tile={left:i*cell,top:j*cell,drift:ox/radius,at:now+distance*55+Math.random()*90};
          if(animate && !reduced.matches)pending.push(tile);
          else detach(tile,false);
        }
      }
    }
    if(pending.length && !frame) {lastFrame=now;frame=requestAnimationFrame(settle)}
  }
  function paint() {
    if (complete || !width || !height) return;
    const scale = Math.min(devicePixelRatio, 2);
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    dust.width=canvas.width; dust.height=canvas.height;
    air.setTransform(scale,0,0,scale,0,0);
    columns=Math.ceil(width/cell); rows=Math.ceil(height/cell);
    cleared=new Uint8Array(columns*rows); pending=[]; grains=[];
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'soft-light';
    if (texture !== 'plain' && grainImage?.complete && grainImage.naturalWidth) {
      ctx.globalAlpha = strength;
      ctx.fillStyle = ctx.createPattern(grainImage, 'repeat');
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalAlpha = texture === 'linen' ? strength * .38 : 0;
    ctx.fillStyle = 'white';
    for (let y=0; y<height; y+=4) ctx.fillRect(0,y,width,1);
    ctx.fillStyle = '#264d38';
    for (let x=0; x<width; x+=3) ctx.fillRect(x,0,1,height);
    ctx.globalAlpha = 1;
    cutShore(ctx, width, height, index, cleared, columns, cell);
    for (const stroke of strokes) {
      let from;
      for (const [u,v,r] of stroke) {
        const x = u*width, y = v*height;
        erase(x,y,from,r);
        from = {x,y};
      }
    }
  }
  new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width !== width || rect.height !== height) {
      width = rect.width; height = rect.height; previous = null; paint();
    }
  }).observe(story);
  pulp.addEventListener('load', paint, {once:true});
  function show() {
    complete = true;
    strokes.length = 0;
    cancelAnimationFrame(frame);
    pending=[]; grains=[];
    canvas.remove(); dust.remove(); reveal.remove();
  }
  reveal.onclick = show;
  if (story.hasAttribute('data-palette-preview')) {
    story.addEventListener('palettechange', ({detail}) => {
      ({base, colors, texture, strength, grainImage} = detail);
      paint();
    });
    story.addEventListener('scratchreset', () => {
      if (complete) story.append(canvas, dust, reveal);
      complete = false;
      previous = null;
      strokes.length = 0;
      paint();
    });
  }
  stories.push({
    reset(){previous = null},
    sample(e){
      if (complete || !width || !height || story.closest('[inert]')) {previous=null;return}
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX-rect.left, y = e.clientY-rect.top;
      const radius = e.pointerType === 'touch' ? 34 : 43;
      const gapX = Math.max(0,-x,x-width), gapY = Math.max(0,-y,y-height);
      if (Math.hypot(gapX,gapY)>radius) {previous=null;return}
      if (!previous) strokes.push([]);
      erase(x,y,previous,radius,true);
      strokes.at(-1).push([x/width,y/height,radius]);
      previous={x,y};
    }
  });
}

document.querySelectorAll('#journey .tc-timeline__desc').forEach(mount);
function move(e){for(const story of stories)story.sample(e)}
function reset(){for(const story of stories)story.reset()}
document.addEventListener('pointermove',move,{passive:true});
document.addEventListener('pointerdown',e=>{reset();move(e)},{passive:true});
document.addEventListener('pointercancel',reset);
document.addEventListener('pointerup',reset);
document.documentElement.addEventListener('pointerleave',reset);
window.addEventListener('scroll',reset,{passive:true});
