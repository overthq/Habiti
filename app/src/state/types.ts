import { SetState, GetState } from 'zustand';

export type StoreSlice<T extends object, E extends object = T> = (
	set: SetState<E extends T ? E : E & T>,
	get: GetState<E extends T ? E : E & T>
) => T;

export interface AuthSlice {
	userId: string | null;
	accessToken: string | null;
}

export interface PreferencesSlice {
	theme: 'light' | 'dark' | 'auto';
	defaultCard: string | null;
}

export type AppState = AuthSlice & PreferencesSlice;
