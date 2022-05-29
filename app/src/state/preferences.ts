import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
	theme: 'light' | 'dark' | 'auto';
	defaultCard: string | null;
}

export const usePreferencesStore = create(
	persist<PreferencesState>(
		set => ({
			theme: 'light',
			defaultCard: null,
			setPreference: (payload: Partial<PreferencesState>) => {
				set(payload);
			}
		}),
		{
			name: 'preferences',
			getStorage: () => AsyncStorage
		}
	)
);
