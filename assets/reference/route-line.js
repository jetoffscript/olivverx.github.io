/** Route drawing adapted from The Cannon, Ryan Ray, https://ryanray.blog/about/. */
(()=>{
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
	const initRoute = () => {
		const main = document.querySelector('.tc-landing-main');
		const root = document.querySelector('.wp-site-blocks');
		if (!main || !root) {
			return;
		}

		const checkpoints = Array.from(root.querySelectorAll('[data-route-cp]'));
		if (checkpoints.length < 2) {
			return;
		}

		// Usually already set by the inline head script; kept for cached HTML.
		document.documentElement.classList.add('tc-has-route');

		const wide = window.matchMedia('(min-width: 1100px)');
		const NS = 'http://www.w3.org/2000/svg';
		const make = (tag, attrs = {}) => {
			const el = document.createElementNS(NS, tag);
			Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
			return el;
		};

		const svg = make('svg', { class: 'tc-route', 'aria-hidden': 'true', focusable: 'false' });
		const ghost = make('path', { class: 'tc-route__ghost' });
		const glow = make('path', { class: 'tc-route__glow' });
		const line = make('path', { class: 'tc-route__line' });
		const markers = make('g', { class: 'tc-route__cps' });
		// A jet fighter follows the route tangent.
		// Font Awesome Free 5.15.4, Fonticons, Inc.; CC BY 4.0.
		// https://github.com/FortAwesome/Font-Awesome/blob/5.x/svgs/solid/fighter-jet.svg
		// Adapted with white/green shaded facets and cockpit; original SVG in assets/images.
		const rider = make('g', { class: 'tc-route__rider' });
		const plane = make('g', { class: 'tc-route__plane' });
		// Exhaust stays in the plane's local coordinates, behind its tail.
		const exhaustDefs = make('defs');
		const plumeGradient = make('linearGradient', { id: 'jet-plume-gradient', x1: '0%', x2: '100%' });
		plumeGradient.append(
			make('stop', { offset: '0%', 'stop-color': '#b4f5ee', 'stop-opacity': '0' }),
			make('stop', { offset: '60%', 'stop-color': '#18805e', 'stop-opacity': '.85' }),
			make('stop', { offset: '100%', 'stop-color': '#75dec0', 'stop-opacity': '1' }),
		);
		const trailGradient = make('linearGradient', { id: 'jet-trail-gradient', x1: '0%', x2: '100%' });
		trailGradient.append(
			make('stop', { offset: '0%', 'stop-color': '#8ce4da', 'stop-opacity': '0' }),
			make('stop', { offset: '100%', 'stop-color': '#18805e', 'stop-opacity': '.9' }),
		);
		exhaustDefs.append(plumeGradient, trailGradient);
		const exhaust = make('g', { class: 'tc-route__exhaust', transform: 'translate(-20 0)', opacity: '0' });
		const trails = make('path', { fill: 'none', stroke: 'url(#jet-trail-gradient)', 'stroke-width': '1.25', 'stroke-linecap': 'round' });
		exhaust.append(trails);
		const engines = [-4, 4].map((offset) => {
			const nozzle = make('g', { class: 'tc-route__nozzle', transform: `translate(0 ${offset})` });
			const plume = make('path', { fill: 'url(#jet-plume-gradient)' });
			const core = make('path', { fill: '#ffffff', 'fill-opacity': '.9' });
			nozzle.append(plume, core);
			exhaust.append(nozzle);
			return { plume, core };
		});
		plane.append(exhaustDefs, exhaust);
		const jet = make('g', { transform: 'scale(0.065625) translate(-320 -256)' });
		const jetOutline = 'M544 224l-128-16-48-16h-24L227.158 44h39.509C278.333 44 288 41.375 288 38s-9.667-6-21.333-6H152v12h16v164h-48l-66.667-80H18.667L8 138.667V208h8v16h48v2.666l-64 8v42.667l64 8V288H16v16H8v69.333L18.667 384h34.667L120 304h48v164h-16v12h114.667c11.667 0 21.333-2.625 21.333-6s-9.667-6-21.333-6h-39.509L344 320h24l48-16 128-16c96-21.333 96-26.583 96-32 0-5.417 0-10.667-96-32z';
		const clip = make('clipPath', { id: 'jet-route-silhouette' });
		clip.append(make('path', { d: jetOutline }));
		const defs = make('defs');
		defs.append(clip);
		jet.append(defs);
		jet.append(make('path', { class: 'tc-route__jet-body', d: jetOutline }));
		const facets = make('g', { 'clip-path': 'url(#jet-route-silhouette)' });
		facets.append(make('path', {
			fill: 'var(--tc-primary)', d: 'M 140 20 L 220 20 L 370 220 L 150 235 Z M 0 110 L 65 110 L 150 235 L 0 235 Z',
		}));
		facets.append(make('path', {
			fill: 'var(--tc-primary)', d: 'M 150 277 L 370 292 L 220 492 L 140 492 Z M 0 277 L 150 277 L 65 402 L 0 402 Z',
		}));
		facets.append(make('path', {
			fill: '#e5e9e7', d: 'M 35 256 L 640 256 L 544 288 L 416 304 L 165 291 L 35 277 Z',
		}));
		facets.append(make('path', {
			fill: '#ffffff', d: 'M 80 251 L 350 228 L 544 236 L 640 256 L 350 256 Z',
		}));
		facets.append(make('path', {
			fill: 'var(--tc-primary)', d: 'M 379 256 Q 405 230 465 238 Q 504 241 529 256 Q 504 271 465 274 Q 405 282 379 256 Z',
		}));
		facets.append(make('path', {
			fill: '#ffffff', 'fill-opacity': '0.75', d: 'M 407 250 Q 455 236 500 250 L 464 253 Z',
		}));
		facets.append(make('path', {
			fill: 'none', stroke: '#ffffff', 'stroke-opacity': '0.65', 'stroke-width': '7', d: 'M 173 65 L 326 215 M 173 447 L 326 297',
		}));
		jet.append(facets);
		plane.append(jet);
		rider.append(plane);
		svg.append(ghost, glow, line, markers, rider);
		root.append(svg);

		const sampleStep = 16; // Gentle curves need fewer samples during animated layout.
		let samples = [];
		let total = 0;
		let cpLengths = [];
		let cpDots = [];
		let rootTop = 0;
		let drawn = 0;
		let target = 0;
		let rotation = 90;
		let direction = 1;
		let frame = 0;
		let thrust = 0;
		let lastTick = 0;
		let introDone = reduceMotion.matches;

		// Layout position relative to .wp-site-blocks, ignoring reveal transforms.
		const offsetWithin = (el) => {
			let x = 0;
			let y = 0;
			let node = el;
			while (node && node !== root) {
				x += node.offsetLeft;
				y += node.offsetTop;
				node = node.offsetParent;
				if (node && node !== root && !root.contains(node)) {
					break;
				}
			}
			return { x, y };
		};

		const pointFor = (cp) => {
			const dot = cp.querySelector('.tc-cp__dot') || cp;
			const pos = offsetWithin(dot);
			return { x: pos.x + dot.offsetWidth / 2, y: pos.y + dot.offsetHeight / 2 };
		};

		// A meandering line through each checkpoint. Every node sits on the rail with a
		// vertical tangent, and bends only swing toward the content, so the labels
		// parked left of the rail never get crossed.
		const buildPath = (pts) => {
			const f = (n) => n.toFixed(1);
			let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
			for (let i = 0; i < pts.length - 1; i++) {
				const a = pts[i];
				const b = pts[i + 1];
				const dy = b.y - a.y;
				const bends = 2; // Stable topology while a chapter expands or collapses.
				const amp = Math.min(34, 10 + dy / 40);
				let x0 = a.x;
				let y0 = a.y;
				for (let k = 0; k < bends; k++) {
					const x1 = a.x + (b.x - a.x) * ((k + 1) / bends);
					const y1 = a.y + dy * ((k + 1) / bends);
					const swing = (i + k) % 2 === 0 ? amp : amp * 0.35;
					const xm = (x0 + x1) / 2 + swing;
					const ym = (y0 + y1) / 2;
					const q = (y1 - y0) / 4;
					d += ` C ${f(x0)} ${f(y0 + q)}, ${f(xm)} ${f(ym - q)}, ${f(xm)} ${f(ym)}`;
					d += ` C ${f(xm)} ${f(ym + q)}, ${f(x1)} ${f(y1 - q)}, ${f(x1)} ${f(y1)}`;
					x0 = x1;
					y0 = y1;
				}
			}
			return d;
		};

		const lengthAtY = (y) => {
			if (!samples.length) {
				return 0;
			}
			if (y <= samples[0].y) {
				return 0;
			}
			const last = samples[samples.length - 1];
			if (y >= last.y) {
				return total;
			}
			let lo = 0;
			let hi = samples.length - 1;
			while (hi - lo > 1) {
				const mid = (lo + hi) >> 1;
				if (samples[mid].y < y) {
					lo = mid;
				} else {
					hi = mid;
				}
			}
			const s0 = samples[lo];
			const s1 = samples[hi];
			const t = s1.y === s0.y ? 0 : (y - s0.y) / (s1.y - s0.y);
			return s0.l + (s1.l - s0.l) * t;
		};

		const pointAt = (l) => {
			if (!samples.length) {
				return { x: 0, y: 0 };
			}
			const distance = Math.max(0, Math.min(total, l));
			const index = Math.min(samples.length - 2, Math.floor(distance / sampleStep));
			const start = samples[index];
			const end = samples[index + 1];
			const t = end.l === start.l ? 0 : (distance - start.l) / (end.l - start.l);
			return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
		};

		const build = () => {
			if (!wide.matches) {
				svg.style.display = 'none';
				return;
			}
			svg.style.display = '';

			const previousY = samples.length ? pointAt(drawn).y : null;
			const width = root.clientWidth;
			const height = root.offsetHeight;
			svg.setAttribute('width', width);
			svg.setAttribute('height', height);
			svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

			const rect = root.getBoundingClientRect();
			rootTop = rect.top + window.scrollY;

			const pts = checkpoints.map(pointFor);
			const d = buildPath(pts);
			[ghost, glow, line].forEach((p) => p.setAttribute('d', d));

			total = line.getTotalLength();
			samples = [];
			for (let l = 0; l <= total; l += sampleStep) {
				const p = line.getPointAtLength(l);
				samples.push({ l, x: p.x, y: p.y });
			}
			const end = line.getPointAtLength(total);
			samples.push({ l: total, x: end.x, y: end.y });

			// The curve is monotonic in y, so y → length is a clean lookup.
			cpLengths = pts.map((p) => lengthAtY(p.y));

			cpDots = pts.map((p, i) => {
				const c = cpDots[i] || make('circle', { class: 'tc-route__cp', r: '7' });
				c.setAttribute('cx', p.x.toFixed(1));
				c.setAttribute('cy', p.y.toFixed(1));
				if (!c.parentNode) markers.append(c);
				return c;
			});

			[glow, line].forEach((p) => {
				p.style.strokeDasharray = `${total} ${total}`;
			});

			if (previousY !== null) drawn = lengthAtY(previousY);
			update();
		};

		const paint = (len) => {
			const offset = Math.max(0, total - len);
			line.style.strokeDashoffset = offset;
			glow.style.strokeDashoffset = offset;
			const p = pointAt(len);
			rider.setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y - 2).toFixed(1)})`);
			plane.setAttribute('transform', `rotate(${rotation.toFixed(2)})`);
			rider.style.opacity = len > 1 && len < total - 1 ? '1' : '0';
			cpLengths.forEach((cpLen, i) => {
				const passed = len >= cpLen - 2;
				cpDots[i]?.classList.toggle('is-passed', passed);
				checkpoints[i].classList.toggle('is-passed', passed);
			});
		};

		// Where the rider should be: a little past mid-viewport, sprinting to the
		// finish during the last half-screen of scroll so the finish is reachable.
		const targetLength = () => {
			const vh = window.innerHeight;
			const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
			const y = window.scrollY;
			const sprintStart = maxScroll - vh * 0.5;
			const sprint = y > sprintStart ? Math.min(1, (y - sprintStart) / (vh * 0.5)) : 0;
			const headY = y - rootTop + vh * (0.58 + 0.42 * sprint);
			return lengthAtY(headY);
		};

		const headingAt = (len) => {
			const before = pointAt(Math.max(0, len - 12));
			const after = pointAt(Math.min(total, len + 12));
			return Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + (direction < 0 ? 180 : 0);
		};
		const angleDelta = (to, from) => ((to - from + 540) % 360 + 360) % 360 - 180;

		const tick = (now) => {
			frame = 0;
			const dt = lastTick ? Math.min(50, Math.max(1, now - lastTick)) : 1000 / 60;
			lastTick = now;
			const previous = drawn;
			const diff = target - drawn;
			// Direction follows reader scrolling, not accordion geometry changes.
			// Ease toward the target with a gentle, weighted follow.
			drawn += Math.abs(diff) < 0.05 ? diff : diff * 0.055;
			const rotationTarget = headingAt(drawn);
			rotation += angleDelta(rotationTarget, rotation) * 0.08;
			const speed = Math.abs(drawn - previous) / dt;
			const desiredThrust = reduceMotion.matches ? 0 : Math.min(1, Math.sqrt(speed / .55));
			thrust += (desiredThrust - thrust) * (1 - Math.exp(-dt / (desiredThrust > thrust ? 55 : 320)));
			if (thrust < .003) thrust = 0;
			const length = 12 + 32 * thrust;
			const flicker = Math.sin(now * .018) * .4 * thrust;
			exhaust.setAttribute('opacity', thrust.toFixed(3));
			for (const { plume, core } of engines) {
				plume.setAttribute('d', `M 1 -1.5 Q ${-length * .35} ${-2 - flicker} ${-length} 0 Q ${-length * .35} ${2 + flicker} 1 1.5 Z`);
				core.setAttribute('d', `M 1 -.6 Q -5 -.9 ${-length * .52} 0 Q -5 .9 1 .6 Z`);
			}
			trails.setAttribute('d', `M -3 -5 Q ${-length * .6} ${-7 + flicker} ${-length * 1.55} -6 M -6 5 Q ${-length * .8} ${7 + flicker} ${-length * 1.7} 5`);
			paint(drawn);
			if (Math.abs(target - drawn) > 0.05 || Math.abs(angleDelta(rotationTarget, rotation)) > 0.05 || thrust > 0) {
				frame = requestAnimationFrame(tick);
			} else {
				lastTick = 0;
				introDone = true;
			}
		};

		const update = (immediate = false) => {
			if (!wide.matches || !total) {
				return;
			}
			if (reduceMotion.matches) {
				thrust = 0;
				exhaust.setAttribute('opacity', '0');
				drawn = target = total;
				rotation = headingAt(total);
				paint(total);
				rider.style.opacity = '0';
				return;
			}
			target = targetLength();
			if (immediate && introDone) {
				drawn = target;
				rotation = headingAt(drawn);
				paint(drawn);
				return;
			}
			if (!frame) {
				frame = requestAnimationFrame(tick);
			}
		};

		let rebuildFrame = 0;
		const queueBuild = () => {
			cancelAnimationFrame(rebuildFrame);
			rebuildFrame = requestAnimationFrame(build);
		};

		let lastScrollY = window.scrollY;
		window.addEventListener(
			'scroll',
			() => {
				const scrollDelta = window.scrollY - lastScrollY;
				if (Math.abs(scrollDelta) > 1) direction = Math.sign(scrollDelta);
				lastScrollY = window.scrollY;
				// Once the reader takes over, the rider follows them instead of the intro.
				lastTick = 0;
				introDone = true;
				update();
			},
			{ passive: true }
		);
		window.addEventListener('resize', queueBuild);
		wide.addEventListener?.('change', queueBuild);
		reduceMotion.addEventListener?.('change', queueBuild);
		if ('ResizeObserver' in window) {
			new ResizeObserver(queueBuild).observe(root);
		}
		window.addEventListener('load', queueBuild);
		document.fonts?.ready.then(queueBuild);

		// Narrow screens have no rail; mark checkpoints as they come into view instead.
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!wide.matches && entry.isIntersecting) {
							entry.target.classList.add('is-passed');
						}
					});
				},
				{ rootMargin: '0px 0px -30% 0px' }
			);
			checkpoints.forEach((cp) => io.observe(cp));
		}

		build();
	};

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initRoute,{once:true}); else initRoute();
})();
