import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
	persist(
		set => ({
			userId: null,
			accessToken: null,
			logIn: (userId: string, accessToken: string) => {
				set({ userId, accessToken });
			},
			logOut: () => {
				set({ userId: null, accessToken: null });
			}
		}),
		{
			name: 'auth',
			getStorage: () => AsyncStorage
		}
	)
);
