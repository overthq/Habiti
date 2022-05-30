import { StatusBarStyle } from 'expo-status-bar';
import { PreferencesSlice } from '../state/types';

export const getStatusBarStyle = (theme: PreferencesSlice['theme']) => {
	return (
		{ light: 'dark', dark: 'light' } as Record<
			PreferencesSlice['theme'],
			StatusBarStyle
		>
	)[theme];
};
