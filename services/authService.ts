import { User } from '../types';

// This is a mock service. In a real application, you would use Supabase client.
// All data is stored in localStorage to simulate session persistence.

const MOCK_USER_KEY = 'praxis_mock_user';

class AuthService {
  async login(email: string, password?: string): Promise<User | null> {
    // In a real app, this would be an API call to Supabase.
    // Here, we just mock a successful login for any non-empty credentials.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const user: User = {
            id: 'mock-user-id-' + email,
            email: email,
          };
          localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 500);
    });
  }

  async logout(): Promise<void> {
    // FIX: Awaited getUser() to get the user object and correctly remove their conversation data upon logout.
    const user = await this.getUser();
    localStorage.removeItem(MOCK_USER_KEY);
    // Also clear conversation cache for this user
    if (user) {
        localStorage.removeItem('praxis_mock_conversations_' + user.id);
    }
  }

  async getUser(): Promise<User | null> {
    return new Promise((resolve) => {
        const userJson = localStorage.getItem(MOCK_USER_KEY);
        if (userJson) {
            resolve(JSON.parse(userJson) as User);
        } else {
            resolve(null);
        }
    });
  }
}

export const authService = new AuthService();