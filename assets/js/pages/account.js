import { supabase } from '../core/supabase.js';

const form = document.querySelector('#authForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const status = document.querySelector('#status');
const sessionBox = document.querySelector('#sessionBox');

function setStatus(message) {
  status.textContent = message;
}

async function renderSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  sessionBox.classList.remove('hidden');
  sessionBox.innerHTML = `
    Signed in as <b>${session.user.email}</b>
    <br>
    <button id="logout" class="secondary" type="button">Sign out</button>
  `;

  document.querySelector('#logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Signing in...');

  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value.trim(),
    password: passwordInput.value,
  });

  if (error) {
    setStatus(error.message);
    return;
  }

  setStatus('Signed in successfully.');
  await renderSession();
});

document.querySelector('#signup').addEventListener('click', async () => {
  setStatus('Creating account...');

  const { data, error } = await supabase.auth.signUp({
  email: emailInput.value.trim(),
  password: passwordInput.value,
  options: {
    data: {
      full_name: nameInput.value.trim(),
    },
    emailRedirectTo:
      'https://dapz-projectme.github.io/DAPZ-TOOLS/',
  },
});

  if (error) {
    setStatus(error.message);
    return;
  }

  setStatus(
    data.session
      ? 'Account created and signed in.'
      : 'Account created. Check your email if confirmation is enabled.',
  );

  if (data.session) await renderSession();
});

document.querySelector('#google').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo:
      'https://dapz-projectme.github.io/DAPZ-TOOLS/',
  },
});

  if (error) setStatus(error.message);
});

renderSession();
