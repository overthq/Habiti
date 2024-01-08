export interface AuthSlice {
	userId: string | null;
	accessToken: string | null;
	logIn: (userId: string, accessToken: string) => void;
	logOut: () => void;
}

export interface PreferencesSlice {
	theme: 'light' | 'dark' | 'auto';
	activeStore: string | null;
	setPreference: (payload: Partial<PreferencesSlice>) => void;
}

export interface ProductFiltersSlice {
	categories: string[];
	inStock?: boolean;
	minPrice?: undefined;
	maxPrice?: undefined;
	clear(): void;
}

export type Mutators = [['zustand/persist', unknown]];

export type AppState = AuthSlice & PreferencesSlice & ProductFiltersSlice;
