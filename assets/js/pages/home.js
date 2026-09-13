import { TOOLS } from '../core/tools.js';
import {
  consumeGuestUse,
  GUEST_LIMIT,
} from '../core/guest-limit.js';
import { supabase } from '../core/supabase.js';

const grid = document.querySelector('#toolGrid');
const search = document.querySelector('#search');
const accountLink = document.querySelector(
  '.pill[href="account.html"]',
);

let currentSession = null;

/* =========================
   RENDER TOOLS
========================= */

function renderTools(list) {
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No tools found</h3>
        <p>Try another search.</p>
      </div>
    `;

    return;
  }

  grid.innerHTML = list
    .map(
      (tool) => `
        <article class="tool-card">
          <div class="tool-icon">
            ${tool.icon}
          </div>

          <h3>${tool.name}</h3>

          <p>${tool.description}</p>

          <button
            class="tool-button"
            type="button"
            data-slug="${tool.slug}"
          >
            Open tool →
          </button>
        </article>
      `,
    )
    .join('');
}

/* =========================
   ACCOUNT BUTTON
========================= */

function updateAccountButton() {
  if (!accountLink) return;

  if (currentSession?.user) {
    const user = currentSession.user;

    const name =
      user.user_metadata?.full_name?.trim() ||
      user.email?.split('@')[0] ||
      'Account';

    accountLink.textContent = name;
    accountLink.href = 'account.html';
    accountLink.title = user.email || '';
  } else {
    accountLink.textContent = 'Sign in';
    accountLink.href = 'account.html';
    accountLink.removeAttribute('title');
  }
}

/* =========================
   CHECK LOGIN SESSION
========================= */

async function loadSession() {
  try {
    const {
      data,
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error(
        'Supabase session error:',
        error,
      );

      currentSession = null;
    } else {
      currentSession = data.session;
    }
  } catch (error) {
    console.error(
      'Failed to load Supabase session:',
      error,
    );

    currentSession = null;
  }

  updateAccountButton();
}

/* =========================
   INITIALIZE
========================= */

/*
 * Render tools FIRST.
 * Jadi kalau Supabase mengalami error,
 * daftar tools tetap muncul.
 */

renderTools(TOOLS);

/*
 * Check login separately.
 */
loadSession();

/* =========================
   SEARCH
========================= */

if (search) {
  search.addEventListener(
    'input',
    (event) => {
      const query = event.target.value
        .trim()
        .toLowerCase();

      const filteredTools = TOOLS.filter(
        (tool) =>
          `${tool.name} ${tool.description}`
            .toLowerCase()
            .includes(query),
      );

      renderTools(filteredTools);
    },
  );
}

/* =========================
   AUTH STATE
========================= */

supabase.auth.onAuthStateChange(
  (_event, session) => {
    currentSession = session;
    updateAccountButton();
  },
);

/* =========================
   TOOL CLICK
========================= */

if (grid) {
  grid.addEventListener(
    'click',
    (event) => {
      const button =
        event.target.closest('[data-slug]');

      if (!button) return;

      const toolSlug =
        button.dataset.slug;

      /*
       * USER SUDAH LOGIN
       *
       * Tidak terkena batas guest 3x.
       */
      if (currentSession?.user) {
        window.alert(
          `Logged in as ${currentSession.user.email}.\n\n` +
          `Tool: ${toolSlug}\n\n` +
          'Actual tool implementation will be connected next.',
        );

        return;
      }

      /*
       * USER BELUM LOGIN
       *
       * Gunakan guest limit.
       */
      const result =
        consumeGuestUse();

      if (!result.allowed) {
        window.location.href =
          'account.html';

        return;
      }

      window.alert(
        `Demo tool: ${toolSlug}\n\n` +
        `Guest use ${result.uses}/${GUEST_LIMIT}`,
      );
    },
  );
}      currentSession.user.email?.split('@')[0] ||
      'Account';

    accountLink.textContent = name;
    accountLink.href = 'account.html';
    accountLink.title = currentSession.user.email || 'Account';
  } else {
    accountLink.textContent = 'Sign in';
    accountLink.href = 'account.html';
    accountLink.removeAttribute('title');
  }
}

async function loadSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(
      'Failed to get Supabase session:',
      error,
    );

    currentSession = null;
  } else {
    currentSession = data.session;
  }

  updateAccountButton();
}

renderTools(TOOLS);

await loadSession();

search.addEventListener('input', (event) => {
  const query = event.target.value
    .trim()
    .toLowerCase();

  const filtered = TOOLS.filter((tool) =>
    `${tool.name} ${tool.description}`
      .toLowerCase()
      .includes(query),
  );

  renderTools(filtered);
});

supabase.auth.onAuthStateChange(
  (_event, session) => {
    currentSession = session;
    updateAccountButton();
  },
);

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slug]');

  if (!button) return;

  /*
   * USER YANG SUDAH LOGIN
   * Tidak terkena batas 3 penggunaan guest.
   */
  if (currentSession?.user) {
    window.alert(
      `Logged in as ${currentSession.user.email}. ` +
      `Tool: ${button.dataset.slug}. ` +
      'Connect the actual tool implementation for production.',
    );

    return;
  }

  /*
   * GUEST
   * Tetap menggunakan batas 3 kali.
   */
  const result = consumeGuestUse();

  if (!result.allowed) {
    window.location.href = 'account.html';
    return;
  }

  window.alert(
    `Demo tool: ${button.dataset.slug}. ` +
    `Guest use ${result.uses}/${GUEST_LIMIT}. ` +
    'Connect the actual tool implementation for production.',
  );
});
  window.alert(
    `Demo tool: ${button.dataset.slug}. Guest use ${result.uses}/${GUEST_LIMIT}. ` +
    'Connect the actual tool implementation for production.',
  );
});
