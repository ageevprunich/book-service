import { create } from "zustand";

export interface AppUser {
  uid: string;
  email: string | null;
  fullName?: string;
  role: string;
}

interface AuthState {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
