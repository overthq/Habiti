import { StatusBarStyle } from 'expo-status-bar';
import { PreferencesSlice } from '../state/types';

export const ThemeMap: Record<PreferencesSlice['theme'], string> = {
	light: 'Light',
	dark: 'Dark',
	auto: 'Auto'
};

export const getStatusBarStyle = (theme: PreferencesSlice['theme']) => {
	return (
		{ light: 'dark', dark: 'light' } as Record<
			PreferencesSlice['theme'],
			StatusBarStyle
		>
	)[theme];
};
