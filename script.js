const search = document.getElementById('help-search');
const cards = [...document.querySelectorAll('#help-cards .card')];
const noResults = document.getElementById('no-results');

if (search) {
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const haystack = (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase();
      const match = !q || haystack.includes(q);
      card.hidden = !match;
      if (match) shown++;
    });
    noResults.hidden = shown !== 0;
  });
}

const helpParams = new URLSearchParams(window.location.search);
const practiceHelp = helpParams.get('workspace') === 'practice';

if (practiceHelp) {
  document.documentElement.classList.add('practice-help');

  const banner = document.createElement('div');
  banner.className = 'practice-context-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = '<strong>Practice Workspace</strong><span>You opened Help from Practice mode. Practice records stay separate from your real business workspace, and actions described here affect the Practice sandbox while Practice is active.</span>';

  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.insertAdjacentElement('afterend', banner);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin) return;
      if (!target.pathname.endsWith('.html') && target.pathname !== '/' && target.pathname !== window.location.pathname) return;
      target.searchParams.set('workspace', 'practice');
      link.href = target.toString();
    } catch {}
  });
}
