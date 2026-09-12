const STORAGE_KEY = 'dapz_guest_uses';
export const GUEST_LIMIT = 3;

export function getGuestUses() {
  return Number(localStorage.getItem(STORAGE_KEY) || 0);
}

export function consumeGuestUse() {
  const current = getGuestUses();
  if (current >= GUEST_LIMIT) return { allowed: false, uses: current };

  const uses = current + 1;
  localStorage.setItem(STORAGE_KEY, String(uses));
  return { allowed: true, uses };
}
