import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createAuthSlice } from './auth';
import { createPreferencesSlice } from './preferences';
import { AppState } from './types';

const useStore = create<AppState>()(
	persist(
		(...a) => ({
			...createAuthSlice(...a),
			...createPreferencesSlice(...a)
		}),
		{
			name: 'root-store',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: state => ({
				theme: state.theme,
				defaultCard: state.defaultCard
			})
		}
	)
);

export default useStore;
