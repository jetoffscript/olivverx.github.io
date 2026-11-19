import { resolveRoute, projectHash } from './route.mjs';
import { initProjectDialog } from './project-dialog.mjs?v=steps';
import { initThemeToggle } from './theme.mjs?v=1';

initThemeToggle(document, window);

// Expand before anchor positioning; manual toggles animate in place.
function setChapterExpanded(section, expanded, instant = false) {
  const button = section?.querySelector('.jet-fold-toggle');
  if (!button) return;
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  if (instant) panel.style.transition = 'none';
  button.setAttribute('aria-expanded', String(expanded));
  section.dataset.expanded = String(expanded);
  panel.inert = !expanded;
  if (instant) {
    void panel.offsetHeight;
    panel.style.removeProperty('transition');
  }
}
for (const button of document.querySelectorAll('.jet-fold-toggle')) {
  const section = button.closest('section');
  setChapterExpanded(section, false, true);
  button.addEventListener('click', () => setChapterExpanded(section, button.getAttribute('aria-expanded') !== 'true'));
}

const projectDetails = [...document.querySelectorAll('details[data-project]')];
const slugs = projectDetails.map(detail => detail.dataset.project);
const projectDialog = initProjectDialog({onClose:()=>{if(location.hash.startsWith('#project/'))history.replaceState(null,'','#work')}});
function applyRoute({ focus = false } = {}) {
  const route = resolveRoute(location.hash, slugs);
  for (const detail of projectDetails) detail.open = false;
  if (route.type === 'project') {
    if (!projectDialog.isOpen) document.getElementById(`project-${route.slug}`)?.scrollIntoView({block:'start',behavior:'instant'});
    projectDialog.open(route.slug);
    return;
  }
  projectDialog.close({route:true});
  const target = route.type === 'project' ? document.getElementById(`project-${route.slug}`)
    : route.type === 'section' ? document.getElementById(route.id) : null;
  if (target) setChapterExpanded(target, true, true);
  if (target) requestAnimationFrame(() => {
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (focus) {
      const focusTarget = route.type === 'project'
        ? target.querySelector('summary') : target.querySelector('h1, h2');
      if (focusTarget) {
        if (route.type !== 'project') focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }
    }
  });
}
for (const detail of projectDetails) {
  detail.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    history.pushState(null, '', projectHash(detail.dataset.project));
    projectDialog.open(detail.dataset.project, detail.querySelector('summary'));
  });
}
window.addEventListener('hashchange', () => applyRoute({ focus: true }));
window.addEventListener('popstate', () => applyRoute({ focus: true }));
if (location.hash) {
  const initialHash = location.hash;
  applyRoute({ focus: true });
  document.fonts?.ready.then(() => {
    if (location.hash === initialHash) applyRoute({ focus: true });
  });
}

const nav = document.querySelector('.tc-header-nav');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
for (const link of navLinks) {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    applyRoute({ focus: true });
  });
}
const sections = navLinks.map(link => document.getElementById(link.hash.slice(1)));
const indicator = document.createElement('span');
indicator.className = 'jet-nav-indicator';
indicator.setAttribute('aria-hidden', 'true');
const indicatorSurface = document.createElement('span');
indicatorSurface.className = 'jet-nav-surface';
indicator.append(indicatorSurface);
nav.prepend(indicator);
let navFrame = 0;
let activeLink = null;
let capsuleAnimation = null;
let capsuleTravel = null;
function updateNavigation() {
  navFrame = 0;
  const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  const readingLine = Math.max(120, window.innerHeight * .3);
  let index = 0;
  sections.forEach((section, i) => {
    if (section && section.getBoundingClientRect().top <= readingLine) index = i;
  });
  if (atBottom) index = navLinks.length - 1;
  const current = navLinks[index];
  for (const link of navLinks) {
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  const rect = current.parentElement.getBoundingClientRect();
  const container = nav.getBoundingClientRect();
  const paddingX = window.innerWidth > 600 ? 8 : 0;
  const paddingY = window.innerWidth > 600 ? 5 : 0;
  const previousPosition = getComputedStyle(indicator).transform;
  const previousShape = getComputedStyle(indicatorSurface).transform;
  indicator.style.width = `${rect.width + paddingX * 2}px`;
  indicator.style.height = `${rect.height + paddingY * 2}px`;
  indicator.style.transform = `translate(${rect.left - container.left - paddingX}px, ${rect.top - container.top - paddingY}px)`;
  if (activeLink && activeLink !== current && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targetPosition = indicator.style.transform;
    const movingRight = navLinks.indexOf(current) > navLinks.indexOf(activeLink);
    const dropScale = (rect.height + paddingY * 2) * .68 / (rect.width + paddingX * 2);
    const dropShape = movingRight ? '80% 35% 35% 80% / 50% 50% 50% 50%' : '35% 80% 80% 35% / 50% 50% 50% 50%';
    capsuleAnimation?.cancel();
    capsuleTravel?.cancel();
    capsuleTravel = indicator.animate([
      { transform: previousPosition, offset: 0 },
      { transform: previousPosition, offset: .24 },
      { transform: targetPosition, offset: .72 },
      { transform: targetPosition, offset: 1 }
    ], { duration: 820, easing: 'cubic-bezier(.45, 0, .2, 1)' });
    capsuleAnimation = indicatorSurface.animate([
      { transform: previousShape === 'none' ? 'scale(1)' : previousShape, borderRadius: '999px', offset: 0 },
      { transform: `scale(${dropScale}, .68)`, borderRadius: '50%', offset: .24 },
      { transform: 'scale(1.35, .4)', borderRadius: dropShape, offset: .48 },
      { transform: `scale(${dropScale}, .85)`, borderRadius: '50%', offset: .72 },
      { transform: 'scale(1.1, 1.08)', borderRadius: '999px', offset: .9 },
      { transform: 'scale(1)', borderRadius: '999px', offset: 1 }
    ], { duration: 820, easing: 'cubic-bezier(.4, 0, .2, 1)' });
  }
  activeLink = current;
  nav.classList.add('jet-nav-ready');
}
function scheduleNavigation() {
  if (!navFrame) navFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('load', scheduleNavigation);
document.fonts?.ready.then(scheduleNavigation);
new ResizeObserver(scheduleNavigation).observe(document.querySelector('main'));
scheduleNavigation();

// The Cannon's greeting: staggered entrance, then a fresh wave on each hover.
// Animation keyframes are retained in reference/kinetic.css (Ryan Ray).
const greeting = document.querySelector('.tc-home-hero__title.is-split');
if (greeting) {
  const letters = greeting.querySelectorAll('.tc-letter');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  setTimeout(() => greeting.classList.add('is-ready'), reducedMotion.matches ? 0 : letters.length * 55 + 950);
  greeting.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches || !greeting.classList.contains('is-ready')) return;
    greeting.classList.remove('is-waving');
    void greeting.offsetWidth;
    greeting.classList.add('is-waving');
  });
  greeting.addEventListener('animationend', event => {
    if (event.target === letters[letters.length - 1] && event.animationName === 'tc-wave') {
      greeting.classList.remove('is-waving');
    }
  });
}
