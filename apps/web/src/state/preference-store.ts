import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PreferencesSlice {
	theme: 'light' | 'dark' | 'auto';
	defaultCard: string | null;
	setPreference: (
		payload: Partial<Omit<PreferencesSlice, 'setPreference'>>
	) => void;
}

export const usePreferenceStore = create<PreferencesSlice>()(
	persist(
		set => ({
			theme: 'light',
			defaultCard: null,
			setPreference: set
		}),
		{
			name: 'preference-store',
			storage: createJSONStorage(() => window.localStorage)
		}
	)
);
