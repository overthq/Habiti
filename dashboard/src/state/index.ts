import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAuthSlice } from './auth';
import { createPreferencesSlice } from './preferences';
import { createProductFiltersSlice } from './productFilters';
import { AppState } from './types';

const useStore = create<AppState>()(
	persist(
		(...a) => ({
			...createAuthSlice(...a),
			...createPreferencesSlice(...a),
			...createProductFiltersSlice(...a)
		}),
		{
			name: 'root-store',
			getStorage: () => AsyncStorage,
			partialize: state => ({
				accessToken: state.accessToken,
				activeStore: state.activeStore,
				theme: state.theme
			})
		}
	)
);

export default useStore;
