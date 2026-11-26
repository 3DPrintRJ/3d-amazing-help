const search = document.getElementById('help-search');
const cards = [...document.querySelectorAll('#help-cards .card')];
const helpTopicGroups = [...document.querySelectorAll('#help-cards [data-topic-group]')];
const noResults = document.getElementById('no-results');
const searchStatus = document.getElementById('search-status');
const helpResultsHeading = document.getElementById('help-results-heading');

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

  // Keep the six-topic directory compact: a group disappears while none
  // of its article links match the current search. The original 23 card
  // keywords and their individual link behavior remain intact.
  helpTopicGroups.forEach(group => {
    const hasVisibleArticles = [...group.querySelectorAll('.card')].some(card => !card.hidden);
    group.hidden = !hasVisibleArticles;
    group.setAttribute('aria-hidden', hasVisibleArticles ? 'false' : 'true');
  });

  // The live search-status line is the single empty-state message. Showing a
  // second no-results panel duplicated the message on desktop and mobile.
  if (noResults) noResults.hidden = true;
  if (helpResultsHeading) helpResultsHeading.textContent = q ? 'Search results' : 'Explore by topic';
  document.body.classList.toggle('help-search-active', Boolean(q));
  if (searchStatus) {
    searchStatus.textContent = q
      ? (shown === 0 ? `No topics found for “${search.value.trim()}”. Try another search or Contact Support.` : `Showing ${shown} help topic${shown === 1 ? '' : 's'} matching “${search.value.trim()}”.`)
      : `Showing all ${cards.length} help topics.`;
  }
}

if (search) {
  search.addEventListener('input', applyHelpSearch);
  search.addEventListener('search', applyHelpSearch);
  search.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyHelpSearch(); } });
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
  banner.innerHTML = '<strong>Practice workspace</strong><span>Help is open from Practice. Your real Business records remain separate.</span><a class="practice-help-link" href="practice-workspace.html">Practice guide</a>';

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


// Consistent, readable article navigation, inspired by a traditional help manual.
// The page's original article text stays authoritative: do not invent screenshots,
// infer controls, or rewrite saved customer/business records here.
(function enhanceHelpArticles() {
  const article = document.querySelector('main > article.article');
  const main = document.querySelector('main');
  // The illustrated Catalog tutorial has its own authored step-by-step navigation.
  if (!article || !main || main.classList.contains('guide-main')) return;
  if (article.closest('.doc-layout')) return;

  main.classList.add('documentation-main');
  const layout = document.createElement('div');
  layout.className = 'doc-layout';
  const toc = document.createElement('aside');
  toc.className = 'doc-toc';
  const tocDetails = document.createElement('details');
  tocDetails.className = 'doc-toc-details';
  const tocSummary = document.createElement('summary');
  tocSummary.textContent = 'On this page';
  const tocNav = document.createElement('nav');
  tocNav.setAttribute('aria-label', 'Article contents');
  const headings = [...article.querySelectorAll('h2')].filter(h => !h.closest('.guide-next'));
  const taken = new Set([...article.querySelectorAll('[id]')].map(el => el.id));
  headings.forEach((heading, index) => {
    if (!heading.id) {
      const base = heading.textContent.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) || 'section';
      let id = base;
      let n = 2;
      while (taken.has(id)) id = base + '-' + n++;
      heading.id = id;
      taken.add(id);
    }
    const link = document.createElement('a');
    link.href = '#' + encodeURIComponent(heading.id);
    link.textContent = heading.textContent.trim();
    tocNav.append(link);
  });
  if (headings.length >= 2) {
    tocDetails.append(tocSummary, tocNav);
    toc.append(tocDetails);
  }

  const related = {
    'getting-started.html': ['catalog-add-item.html', 'practice-workspace.html', 'create-sale.html'],
    'products.html': ['catalog-add-item.html', 'create-sale.html', 'reports.html'],
    'practice-workspace.html': ['getting-started.html', 'catalog-add-item.html', 'appearance.html'],
    'quick-sale.html': ['create-sale.html', 'payments.html', 'show-mode.html'],
    'create-invoice.html': ['invoices.html', 'quotes.html', 'payments.html'],
    'invoices.html': ['create-invoice.html', 'payments.html', 'reports.html'],
    'settings.html': ['appearance.html', 'practice-workspace.html', 'search.html'],
    'search.html': ['getting-started.html', 'settings.html', 'products.html'],
    'payments.html': ['invoices.html', 'quick-sale.html', 'reports.html'],
    'quotes.html': ['create-sale.html', 'create-invoice.html', 'invoices.html'],
    'customers.html': ['create-sale.html', 'products.html', 'reports.html'],
    'dashboard.html': ['getting-started.html', 'search.html', 'create-sale.html'],
    'events.html': ['quick-sale.html', 'reports.html', 'show-mode.html'],
    'show-mode.html': ['quick-sale.html', 'events.html', 'troubleshooting.html'],
    'reports.html': ['invoices.html', 'payments.html', 'events.html'],
    'appearance.html': ['settings.html', 'practice-workspace.html', 'getting-started.html'],
    'password-help.html': ['troubleshooting.html', 'getting-started.html', 'support.html'],
    'faq.html': ['troubleshooting.html', 'support.html', 'beta-testing.html'],
    'troubleshooting.html': ['password-help.html', 'support.html', 'faq.html'],
    'support.html': ['beta-testing.html', 'faq.html', 'troubleshooting.html'],
    'beta-testing.html': ['practice-workspace.html', 'support.html', 'faq.html'],
    'create-sale.html': ['quick-sale.html', 'create-invoice.html', 'quotes.html']
  };
  const titles = {
    'catalog-add-item.html':'Add a Catalog Item', 'practice-workspace.html':'Practice Workspace',
    'create-sale.html':'Make a Sale','getting-started.html':'Getting Started',
    'products.html':'Catalog & Pricing','reports.html':'Reports',
    'quick-sale.html':'Quick Sale','payments.html':'Payments','show-mode.html':'Offline / Show Mode',
    'create-invoice.html':'Create Invoice','invoices.html':'Sales History',
    'quotes.html':'Quotes','settings.html':'Business Settings','search.html':'Global Search',
    'appearance.html':'Appearance & Themes','customers.html':'Customers','dashboard.html':'Dashboard',
    'events.html':'Events','troubleshooting.html':'Troubleshooting',
    'password-help.html':'Password & Account Recovery','support.html':'Support','faq.html':'FAQ'
  };
  const current = window.location.pathname.split('/').pop();
  const links = related[current];
  if (links && !article.querySelector('.doc-related')) {
    const aside = document.createElement('aside');
    aside.className = 'doc-related';
    aside.setAttribute('aria-label', 'Related help');
    const heading = document.createElement('h2');
    heading.textContent = 'Related help';
    const list = document.createElement('ul');
    for (const target of links) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = target;
      a.textContent = titles[target] || target.replace(/\.html$/, '');
      li.append(a);
      list.append(li);
    }
    aside.append(heading,list);
    article.append(aside);
  }
  main.insertBefore(layout, article);
  layout.append(article);
  if (headings.length >= 2) layout.append(toc);
  const mq = window.matchMedia?.('(min-width: 901px)');
  const setToc = () => { if (headings.length >= 2) tocDetails.open = Boolean(mq?.matches); };
  setToc();
  if (mq?.addEventListener) mq.addEventListener('change', setToc);
  else mq?.addListener?.(setToc);

  // Newly generated related links need to retain the current Practice / app
  // return context, just as the authored links do.
  const parameters = new URLSearchParams(window.location.search);
  document.querySelectorAll('.doc-related a[href]').forEach(link => {
    const dest = new URL(link.getAttribute('href'), window.location.href);
    if (parameters.get('workspace') === 'practice') dest.searchParams.set('workspace','practice');
    if (parameters.has('help_mode')) dest.searchParams.set('help_mode', parameters.get('help_mode'));
    if (parameters.has('app_return')) dest.searchParams.set('app_return', parameters.get('app_return'));
    link.href = dest.toString();
  });
})();
