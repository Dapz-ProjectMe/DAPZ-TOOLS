import { supabase } from '../core/supabase.js';

const status = document.querySelector('#status');
const tableBody = document.querySelector('#users');
const stats = document.querySelector('#stats');
const search = document.querySelector('#userSearch');

let profiles = [];
let usageCounts = {};

function setStatus(message) {
  status.textContent = message;
}

function renderUsers() {
  const query = search.value.trim().toLowerCase();
  const filtered = profiles.filter((profile) =>
    `${profile.full_name || ''} ${profile.email || ''}`.toLowerCase().includes(query),
  );

  tableBody.innerHTML = filtered.map((profile) => `
    <tr>
      <td>${profile.full_name || '—'}</td>
      <td>${profile.email || '—'}</td>
      <td>${new Date(profile.created_at).toLocaleString()}</td>
      <td>${profile.is_admin ? 'Yes' : 'No'}</td>
      <td>${usageCounts[profile.id] || 0}</td>
    </tr>
  `).join('');
}

async function loadDashboard() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '../account.html';
    return;
  }

  const { data: currentUser, error: adminError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (adminError || !currentUser?.is_admin) {
    setStatus('Access denied.');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id,full_name,email,created_at,is_admin')
    .order('created_at', { ascending: false });

  if (error) {
    setStatus(error.message);
    return;
  }

  const { data: usageEvents, error: usageError } = await supabase
    .from('usage_events')
    .select('user_id');

  if (usageError) {
    setStatus(usageError.message);
    return;
  }

  profiles = data || [];
  usageCounts = {};

  for (const event of usageEvents || []) {
    usageCounts[event.user_id] = (usageCounts[event.user_id] || 0) + 1;
  }

  stats.innerHTML = `
    <div class="stat"><span>Users</span><b>${profiles.length}</b></div>
    <div class="stat"><span>Usage events</span><b>${(usageEvents || []).length}</b></div>
    <div class="stat"><span>Admins</span><b>${profiles.filter((user) => user.is_admin).length}</b></div>
  `;

  renderUsers();
}

search.addEventListener('input', renderUsers);

document.querySelector('#logout').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = '../account.html';
});

loadDashboard();
