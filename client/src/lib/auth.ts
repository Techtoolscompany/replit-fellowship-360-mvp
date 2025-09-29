import { type UserWithChurch } from "@shared/schema";

interface LoginResponse {
  token: string;
  user: UserWithChurch;
}

export class AuthService {
  private static TOKEN_KEY = 'gracecrm_token';
  private static USER_KEY = 'gracecrm_user';

  static setAuth(data: LoginResponse) {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): UserWithChurch | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static clearAuth() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export function useAuth() {
  const user = AuthService.getUser();
  const isAuthenticated = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    AuthService.setAuth(data);
    return data;
  };

  const logout = () => {
    AuthService.clearAuth();
    window.location.reload();
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
}
