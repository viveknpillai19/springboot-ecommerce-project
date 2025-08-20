import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  setAuth: (token: string, email: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (credentials: LoginRequest) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { token, email } = response.data;
        
        set({
          token,
          email,
          isAuthenticated: true,
          isAdmin: email.includes('admin') || false, // Simple admin check
        });
        
        return response.data;
      },
      
      register: async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { token, email } = response.data;
        
        set({
          token,
          email,
          isAuthenticated: true,
          isAdmin: data.role === 'ROLE_ADMIN',
        });
        
        return response.data;
      },
      
      logout: () => {
        set({
          token: null,
          email: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
      
      setAuth: (token: string, email: string) => {
        set({
          token,
          email,
          isAuthenticated: true,
          isAdmin: email.includes('admin') || false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);