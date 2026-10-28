const search = document.getElementById('help-search');
const cards = [...document.querySelectorAll('#help-cards .card')];
const noResults = document.getElementById('no-results');
const searchStatus = document.getElementById('search-status');

function applyHelpSearch() {
  if (!search) return;
  const q = search.value.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  let shown = 0;

  cards.forEach(card => {
    const haystack = (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase();
    const match = terms.length === 0 || terms.every(term => haystack.includes(term));
    card.classList.toggle('search-hidden', !match);
    card.hidden = !match;
    card.setAttribute('aria-hidden', match ? 'false' : 'true');
    if (match) shown++;
  });

  if (noResults) noResults.hidden = shown !== 0;
  if (searchStatus) {
    searchStatus.textContent = q
      ? (shown === 0 ? `No help topics match “${search.value.trim()}”.` : `Showing ${shown} help topic${shown === 1 ? '' : 's'} matching “${search.value.trim()}”.`)
      : `Showing all ${cards.length} help topics.`;
  }
}

if (search) {
  search.addEventListener('input', applyHelpSearch);
  search.addEventListener('search', applyHelpSearch);
  search.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      search.value = '';
      applyHelpSearch();
    }
  });
  applyHelpSearch();
}

// Help is a separate GitHub-hosted site from the app. Ordinary browser Help
// opens in the same tab so Return to App cannot leave a duplicate tab behind.
// An installed home-screen app uses a separate OS window: do not open another
// copy of the app in Safari when returning from that external Help page.
const APP_ORIGIN = 'https://app.3damazing.com';
const helpParams = new URLSearchParams(window.location.search);
const helpMode = helpParams.get('help_mode') === 'installed' ? 'installed' : 'browser';
const practiceHelp = helpParams.get('workspace') === 'practice';

function safeReturnAddress(path) {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null;
  try {
    const address = new URL(path, APP_ORIGIN);
    return address.origin === APP_ORIGIN ? address.href : null;
  } catch { return null; }
}

const appReturnAddress = safeReturnAddress(helpParams.get('app_return'));
function showInstalledReturnHelp() {
  let notice = document.getElementById('installed-app-return-help');
  if (!notice) {
    notice = document.createElement('p');
    notice.id = 'installed-app-return-help';
    notice.className = 'help-return-guidance';
    notice.setAttribute('role', 'status');
    notice.textContent = 'Return to the installed 3D Amazing app using your Home Screen icon or app switcher. If this Help tab stays open, close it in your browser. Your app remains separate.';
    const bar = document.querySelector('.topbar');
    if (bar) bar.insertAdjacentElement('afterend', notice);
    else document.body.prepend(notice);
  }
  notice.focus?.();
}

function returnToOrigin(event) {
  if (helpMode === 'installed') {
    event.preventDefault();
    showInstalledReturnHelp();
    // A script-opened Help window may close; Safari can prohibit closing tabs.
    // Never redirect a standalone-app user to a duplicate Safari app tab.
    try { window.close(); } catch {}
    return;
  }
  event.preventDefault();
  const fallback = safeReturnAddress(new URL(event.currentTarget.href).pathname + new URL(event.currentTarget.href).search);
  window.location.assign(appReturnAddress || fallback || APP_ORIGIN);
}

document.querySelectorAll('a.app-return').forEach(link => {
  if (helpMode === 'installed') {
    link.textContent = '← Back to installed app';
    link.href = '#';
  } else if (appReturnAddress) {
    link.href = appReturnAddress;
    link.textContent = '← Back to 3D Amazing';
  }
  link.addEventListener('click', returnToOrigin);
});

function openAppTarget(path) {
  if (helpMode === 'installed') {
    showInstalledReturnHelp();
    return;
  }
  const address = safeReturnAddress(path);
  if (address) window.location.assign(address);
}

if (practiceHelp) {
  document.documentElement.classList.add('practice-help');

  const banner = document.createElement('div');
  banner.className = 'practice-context-banner';
  banner.setAttribute('role', 'status');
  banner.innerHTML = '<strong>Practice</strong><span>You opened Help from Practice. Practice records stay separate from your real business data, and actions described here affect the Practice sandbox while Practice is active.</span><button type="button" class="practice-reset-link" data-app-target="/settings?section=data&focus=reset-practice">Reset Practice →</button>';

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

document.querySelectorAll('[data-app-target]').forEach(control => {
  control.addEventListener('click', event => {
    event.preventDefault();
    openAppTarget(control.getAttribute('data-app-target') || '/');
  });
});


// Keep What’s New visible from every Help Center page.
document.querySelectorAll('.topbar nav').forEach(nav => {
  if (nav.querySelector('.whats-new-nav')) return;
  const link = document.createElement('a');
  link.className = 'whats-new-nav';
  link.href = 'whats-new.html';
  link.textContent = 'What’s New';
  const roadmap = nav.querySelector('.roadmap-nav');
  const appReturn = nav.querySelector('.app-return');
  nav.insertBefore(link, roadmap || appReturn || nav.firstChild);
});

// Preserve the originating app route and Practice context while browsing Help.
// Query values are propagated only to pages on this Help Center origin.
document.querySelectorAll('a[href]').forEach(link => {
  if (link.classList.contains('app-return') || link.hasAttribute('download')) return;
  const raw = link.getAttribute('href');
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;
  try {
    const target = new URL(raw, window.location.href);
    if (target.origin !== window.location.origin) return;
    const helpDocument = target.pathname.endsWith('.html') || target.pathname.endsWith('/') || target.pathname === window.location.pathname;
    if (!helpDocument) return;
    if (helpParams.has('help_mode')) target.searchParams.set('help_mode',helpMode);
    if (appReturnAddress) target.searchParams.set('app_return',new URL(appReturnAddress).pathname+new URL(appReturnAddress).search+new URL(appReturnAddress).hash);
    if (practiceHelp) target.searchParams.set('workspace','practice');
    link.href = target.toString();
  } catch {}
});
