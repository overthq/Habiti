import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAuthSlice } from './auth';
import { createPreferencesSlice } from './preferences';
import { AppState } from './types';

export const useStore = create(
	persist<AppState>(
		(set, get) => ({
			...createAuthSlice(set, get),
			...createPreferencesSlice(set, get)
		}),
		{
			name: 'root-store',
			getStorage: () => AsyncStorage
		}
	)
);
