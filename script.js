const search = document.getElementById('help-search');
const cards = [...document.querySelectorAll('#help-cards .card')];
const noResults = document.getElementById('no-results');
const clearSearch = document.getElementById('clear-search');
const status = document.getElementById('search-status');
const heading = document.getElementById('results-heading');
const entries = cards.map(card => ({
  card,
  title: card.querySelector('h3').textContent.toLowerCase(),
  text: (card.textContent + ' ' + (card.dataset.search || '')).toLowerCase(),
  fields: [...card.querySelectorAll('h3, p')].map(node => ({ node, text: node.textContent }))
}));

function highlight(node, text, terms) {
  node.replaceChildren();
  const lower = text.toLowerCase();
  let offset = 0;
  while (offset < text.length) {
    let start = -1;
    let match = '';
    for (const term of terms) {
      const index = lower.indexOf(term, offset);
      if (index !== -1 && (start === -1 || index < start)) { start = index; match = term; }
    }
    if (start === -1) { node.append(document.createTextNode(text.slice(offset))); break; }
    node.append(document.createTextNode(text.slice(offset, start)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(start, start + match.length);
    node.append(mark);
    offset = start + match.length;
  }
}

if (search) {
  function updateResults() {
    const query = search.value.trim();
    // Treat simple plurals like invoices/receipts as their singular search stem.
    const terms = [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean).map(term => term.length > 3 && term.endsWith('s') ? term.slice(0, -1) : term))];
    let shown = 0;
    entries.forEach(({ card, text, fields }) => {
      const match = terms.every(term => text.includes(term));
      card.hidden = !match;
      if (match) shown++;
      fields.forEach(field => highlight(field.node, field.text, match ? terms : []));
    });
    // Prioritize articles whose titles match, retaining original order on ties/clear.
    [...entries].sort((a, b) => {
      const score = entry => terms.reduce((total, term) => total + (entry.title.includes(term) ? 1 : 0), 0);
      return score(b) - score(a);
    }).forEach(({card}) => card.parentElement.append(card));
    noResults.hidden = shown !== 0;
    if (clearSearch) clearSearch.hidden = search.value.length === 0;
    if (status) status.textContent = query ? `${shown} result${shown === 1 ? '' : 's'} for “${query}”` : `${cards.length} help topics available`;
    if (heading) heading.textContent = query ? 'Search results' : 'Browse help topics';
    document.body.classList.toggle('help-search-active', Boolean(query));
  }
  search.addEventListener('input', updateResults);
  search.addEventListener('search', updateResults);
  clearSearch?.addEventListener('click', () => { search.value = ''; updateResults(); search.focus(); });
  window.addEventListener('pageshow', updateResults);
  updateResults();
}
