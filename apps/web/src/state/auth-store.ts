import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LoginArgs {
	userId: string;
	accessToken: string;
}

export interface AuthState {
	accessToken: string | null;
	userId: string | null;
	logIn: ({ userId, accessToken }: LoginArgs) => void;
	logOut: () => void;
	setAccessToken: (accessToken: string) => void;
	setUserId: (userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			accessToken: null,
			userId: null,
			setAccessToken: accessToken => set({ accessToken }),
			setUserId: userId => set({ userId }),
			logIn: ({ userId, accessToken }) => set({ userId, accessToken }),
			logOut: () => set({ userId: null, accessToken: null })
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => window.localStorage),
			partialize: state => ({ userId: state.userId })
		}
	)
);
