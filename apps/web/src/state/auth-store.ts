import { create } from 'zustand';

interface LoginArgs {
	accessToken: string;
}

export interface AuthState {
	accessToken: string | null;
	currentEmail: string;
	setCurrentEmail: (email: string) => void;
	logIn: ({ accessToken }: LoginArgs) => void;
	logOut: () => void;
	authModalOpen: boolean;
	toggleAuthModal: () => void;
}

export const useAuthStore = create<AuthState>()(set => ({
	accessToken: null,
	currentEmail: '',
	setCurrentEmail: email => set({ currentEmail: email }),
	logIn: ({ accessToken }) => set({ accessToken }),
	logOut: () => set({ accessToken: null }),
	authModalOpen: false,
	toggleAuthModal: () => set(state => ({ authModalOpen: !state.authModalOpen }))
}));
