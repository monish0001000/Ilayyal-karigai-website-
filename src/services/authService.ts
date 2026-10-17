import { AdminUser, AuthSession } from '../types';

const SESSION_STORAGE_KEY = 'ilayal_admin_session';
const ADMIN_STORE_KEY = 'ilayal_admin_credentials';

// Helper: Secure SHA-256 with salt using Web Crypto API
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredAdminAccount {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'store_manager' | 'editor';
  salt: string;
  passwordHash: string;
  createdAt: string;
}

// Default initial admin account salt and hash for "admin@ilayalkarigai.com" / "Ilayal@Admin2026!"
// Pre-computed with salt: "ik_salt_2026_heritage"
const DEFAULT_SALT = 'ik_salt_2026_heritage';
// Hash of "ik_salt_2026_heritage:Ilayal@Admin2026!"
const INITIAL_ADMIN: StoredAdminAccount = {
  id: 'admin-1',
  email: 'admin@ilayalkarigai.com',
  name: 'Store Administrator',
  role: 'super_admin',
  salt: DEFAULT_SALT,
  passwordHash: '8df726b21aa1c7b80a5585098ff9d33fbda7db542ee596e3860bb6a8e8e7a08b',
  createdAt: '2026-01-01T00:00:00.000Z',
};

class AuthService {
  private currentSession: AuthSession | null = null;
  private isInitialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    if (typeof window === 'undefined') return;

    // Verify or seed initial admin account
    try {
      const stored = localStorage.getItem(ADMIN_STORE_KEY);
      if (!stored) {
        // Pre-compute and verify the default hash to guarantee exact match
        const computed = await hashPassword('Ilayal@Admin2026!', DEFAULT_SALT);
        INITIAL_ADMIN.passwordHash = computed;
        localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify([INITIAL_ADMIN]));
      }
    } catch (e) {
      console.warn('Failed to initialize admin credentials store:', e);
    }

    // Check existing session in sessionStorage
    try {
      const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw) as AuthSession;
        if (session && session.expiresAt > Date.now()) {
          this.currentSession = session;
        } else {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          this.currentSession = null;
        }
      }
    } catch (e) {
      console.warn('Failed to restore admin session:', e);
    }

    this.isInitialized = true;
  }

  public async getSession(): Promise<AuthSession | null> {
    await this.ensureInitialized();
    if (!this.currentSession) return null;
    if (this.currentSession.expiresAt <= Date.now()) {
      await this.logout();
      return null;
    }
    return this.currentSession;
  }

  public async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  public async login(email: string, password: string): Promise<AdminUser> {
    await this.ensureInitialized();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error('Please enter both your email address and password.');
    }

    let accounts: StoredAdminAccount[] = [INITIAL_ADMIN];
    try {
      const stored = localStorage.getItem(ADMIN_STORE_KEY);
      if (stored) {
        accounts = JSON.parse(stored);
      }
    } catch {
      accounts = [INITIAL_ADMIN];
    }

    const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!account) {
      // Intentionally generic error for security
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    const calculatedHash = await hashPassword(password, account.salt);
    if (calculatedHash !== account.passwordHash) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    // Generate secure session token
    const randomBytes = new Uint8Array(24);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');

    // Session valid for 8 hours
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;

    const user: AdminUser = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      lastLogin: new Date().toISOString(),
    };

    const session: AuthSession = {
      user,
      token,
      expiresAt,
    };

    this.currentSession = session;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }

    return user;
  }

  public async logout(): Promise<void> {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  public async changePassword(currentPass: string, newPass: string): Promise<void> {
    await this.ensureInitialized();
    const session = await this.getSession();
    if (!session) throw new Error('You must be signed in to change your password.');
    if (!newPass || newPass.length < 8) {
      throw new Error('New password must be at least 8 characters long.');
    }

    let accounts: StoredAdminAccount[] = [];
    const stored = localStorage.getItem(ADMIN_STORE_KEY);
    if (stored) {
      accounts = JSON.parse(stored);
    }

    const idx = accounts.findIndex((a) => a.id === session.user.id);
    if (idx === -1) throw new Error('Account record not found.');

    const currentHash = await hashPassword(currentPass, accounts[idx].salt);
    if (currentHash !== accounts[idx].passwordHash) {
      throw new Error('Current password does not match.');
    }

    // Generate fresh salt
    const newSaltBytes = new Uint8Array(16);
    crypto.getRandomValues(newSaltBytes);
    const newSalt = Array.from(newSaltBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    const newHash = await hashPassword(newPass, newSalt);

    accounts[idx].salt = newSalt;
    accounts[idx].passwordHash = newHash;
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(accounts));
  }
}

export const authService = new AuthService();
