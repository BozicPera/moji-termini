import apiClient from './client';
import type { LoginCredentials, AuthResponse, User } from '@/types';

export const authAPI = {
  /**
   * Login user and get JWT token
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  /**
   * Logout (client-side only for now)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
