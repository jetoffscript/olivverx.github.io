// Reveal the new theme from the toggle, using native page snapshots.
export function initThemeToggle(document, window) {
  const root = document.documentElement;
  const button = document.querySelector('.tc-theme-toggle');
  let switching = false;

  function updateButton() {
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? '切换为浅色主题' : '切换为深色主题');
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0f1515' : '#f7f6f0';
    try { window.localStorage.setItem('jet-theme', theme); } catch { /* Storage is optional. */ }
    updateButton();
  }

  updateButton();
  button.addEventListener('click', async () => {
    if (switching) return;
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || !root.animate || reduced) {
      applyTheme(theme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    switching = true;
    root.classList.add('tc-theme-switching');
    let transition;
    try {
      transition = document.startViewTransition(() => applyTheme(theme));
      await transition.ready;
      root.animate({
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
      }, {
        duration: 650,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      });
    } catch {
      applyTheme(theme);
    } finally {
      try { await transition?.finished; } catch { /* A skipped transition still applies the theme. */ }
      root.classList.remove('tc-theme-switching');
      switching = false;
    }
  });
}
