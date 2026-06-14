import { create } from 'zustand';

interface AuthState {
  memberData: any | null;

  setMemberData: (member: any) => void;

  clearMemberData: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  memberData: null,

  setMemberData: (member) =>
    set({ memberData: member }),

  clearMemberData: () =>
    set({ memberData: null }),
}));