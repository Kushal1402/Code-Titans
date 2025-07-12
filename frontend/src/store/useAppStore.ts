import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (user: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

export const useAppStore = create<AuthState>((set) => ({
  // Auth state
  isAuthenticated: true,
  isAdmin: true,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
})); 