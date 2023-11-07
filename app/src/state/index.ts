import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
			getStorage: () => AsyncStorage
		}
	)
);

export default useStore;
