import { create } from 'zustand';

interface LoginArgs {
	accessToken: string;
}

export interface AuthState {
	accessToken: string | null;
	logIn: ({ accessToken }: LoginArgs) => void;
	logOut: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
	accessToken: null,
	logIn: ({ accessToken }) => set({ accessToken }),
	logOut: () => set({ accessToken: null })
}));
