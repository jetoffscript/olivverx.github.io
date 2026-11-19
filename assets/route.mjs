/** Resolve only known routes; malformed addresses leave content readable. */
export function resolveRoute(hash, slugs) {
  if (typeof hash !== 'string' || !hash) return { type: 'home' };
  if (hash.startsWith('#project/')) {
    try {
      const slug = decodeURIComponent(hash.slice(9));
      return slugs.includes(slug) ? { type: 'project', slug } : { type: 'home' };
    } catch { return { type: 'home' }; }
  }
  const id = hash.slice(1);
  return ['about', 'work', 'journey', 'life', 'contact'].includes(id)
    ? { type: 'section', id } : { type: 'home' };
}
export function projectHash(slug) { return `#project/${encodeURIComponent(slug)}`; }
