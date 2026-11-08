export interface AuthSlice {
	accessToken: string | null;
	// Whether a session (refresh token) exists. Separate from the access token
	// so a launch where the refresh fails (e.g. server down) stays signed in.
	signedIn: boolean;
	logIn: (accessToken: string) => void;
	logOut: () => void;
}

export interface PreferencesSlice {
	theme: 'light' | 'dark' | 'auto';
	activeStore: string | null;
	setPreference: (payload: Partial<PreferencesSlice>) => void;
}

export type Mutators = [['zustand/persist', unknown]];

export type AppState = AuthSlice & PreferencesSlice;
