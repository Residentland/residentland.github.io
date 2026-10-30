// Prod filters
(() => {
  const chips = [...document.querySelectorAll('[data-filter]')];
  if (!chips.length) return;

  const apply = (filter) => {
    if (!chips.some((c) => c.dataset.filter === filter)) filter = 'all';

    // Chips
    chips.forEach((c) => c.setAttribute('aria-pressed', c.dataset.filter === filter));

    // Cards and empty years
    document.querySelectorAll('.prod-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.format !== filter;
    });
    document.querySelectorAll('.year-group').forEach((group) => {
      group.hidden = !group.querySelector('.prod-card:not([hidden])');
    });
  };

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    apply(filter);
    history.replaceState(null, '', filter === 'all' ? location.pathname : `#${filter}`);
  }));

  apply(decodeURIComponent(location.hash.slice(1)) || 'all');
})();
