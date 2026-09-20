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