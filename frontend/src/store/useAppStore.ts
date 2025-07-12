import {create} from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    role: string;
  } | null;
  login: (user: { name: string; role: string }) => void;
  logout: () => void;
  isAdmin: boolean;
}

export const useAppStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user,isAdmin:user?.role === 'admin' }),
  logout: () => set({ isAuthenticated: false, user: null,isAdmin:false }),
})); 