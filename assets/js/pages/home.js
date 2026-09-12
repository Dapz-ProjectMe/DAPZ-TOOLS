import { TOOLS } from '../core/tools.js';
import { consumeGuestUse, GUEST_LIMIT } from '../core/guest-limit.js';

const grid = document.querySelector('#toolGrid');
const search = document.querySelector('#search');

function renderTools(list) {
  grid.innerHTML = list.map((tool) => `
    <article class="tool-card">
      <div class="tool-icon">${tool.icon}</div>
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <button class="tool-button" type="button" data-slug="${tool.slug}">Open tool →</button>
    </article>
  `).join('');
}

renderTools(TOOLS);

search.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();
  const filtered = TOOLS.filter((tool) =>
    `${tool.name} ${tool.description}`.toLowerCase().includes(query),
  );
  renderTools(filtered);
});

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slug]');
  if (!button) return;

  const result = consumeGuestUse();
  if (!result.allowed) {
    window.location.href = 'account.html';
    return;
  }

  window.alert(
    `Demo tool: ${button.dataset.slug}. Guest use ${result.uses}/${GUEST_LIMIT}. ` +
    'Connect the actual tool implementation for production.',
  );
});
