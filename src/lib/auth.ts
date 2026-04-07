const STORAGE_KEYS = {
  HASH: 'mmk_admin_hash',
  SALT: 'mmk_admin_salt',
};

export async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMat,
    256
  );
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt(): string {
  const a = new Uint8Array(24);
  crypto.getRandomValues(a);
  return Array.from(a)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function initAuth() {
  const salt = localStorage.getItem(STORAGE_KEYS.SALT);
  const hash = localStorage.getItem(STORAGE_KEYS.HASH);

  if (!salt || !hash) {
    const newSalt = generateSalt();
    // Default password as per previous version
    const newHash = await pbkdf2Hash('M@2024#secure', newSalt);
    localStorage.setItem(STORAGE_KEYS.SALT, newSalt);
    localStorage.setItem(STORAGE_KEYS.HASH, newHash);
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const salt = localStorage.getItem(STORAGE_KEYS.SALT);
  const hash = localStorage.getItem(STORAGE_KEYS.HASH);

  if (!salt || !hash) return false;

  const attempt = await pbkdf2Hash(password, salt);
  return attempt === hash;
}

export async function updatePassword(newPassword: string) {
  const newSalt = generateSalt();
  const newHash = await pbkdf2Hash(newPassword, newSalt);
  localStorage.setItem(STORAGE_KEYS.SALT, newSalt);
  localStorage.setItem(STORAGE_KEYS.HASH, newHash);
}
