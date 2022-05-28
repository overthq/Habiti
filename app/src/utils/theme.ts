import { StatusBarStyle } from 'expo-status-bar';
import { PreferencesState } from '../redux/preferences/types';

export const getStatusBarStyle = (theme: PreferencesState['theme']) => {
	return (
		{ light: 'dark', dark: 'light' } as Record<
			PreferencesState['theme'],
			StatusBarStyle
		>
	)[theme];
};
