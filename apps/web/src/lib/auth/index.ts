export const AuthService = {
  /**
   * The frontend relies on Supabase auth cookies, so API requests do not require
   * explicit Authorization headers at the moment. This helper returns an empty
   * object to satisfy existing query client logic and can be extended when token
   * based auth is introduced.
   */
  getAuthHeaders(): Record<string, string> {
    return {};
  },
};
