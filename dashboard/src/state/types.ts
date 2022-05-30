import { SetState, GetState } from 'zustand';

export type StoreSlice<T extends object, E extends object = T> = (
	set: SetState<E extends T ? E : E & T>,
	get: GetState<E extends T ? E : E & T>
) => T;

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

export type AppState = AuthSlice & PreferencesSlice;
