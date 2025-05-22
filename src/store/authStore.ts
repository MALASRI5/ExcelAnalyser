import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userUpdate: Partial<User>) => void;
}

// In a real app, this would connect to a backend API
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo login - in a real app this would validate with a backend
      if (email === 'demo@example.com' && password === 'password') {
        set({
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'user',
          },
          isLoading: false,
        });
      } else if (email === 'admin@example.com' && password === 'password') {
        set({
          isAuthenticated: true,
          user: {
            id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
          },
          isLoading: false,
        });
      } else {
        set({
          error: 'Invalid email or password',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: 'An error occurred during login',
        isLoading: false,
      });
    }
  },
  
  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo signup - in a real app this would create a user in the backend
      set({
        isAuthenticated: true,
        user: {
          id: '3',
          name,
          email,
          role: 'user',
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'An error occurred during signup',
        isLoading: false,
      });
    }
  },
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  
  updateProfile: (userUpdate) => {
    set(state => ({
      user: state.user ? { ...state.user, ...userUpdate } : null,
    }));
  },
}));