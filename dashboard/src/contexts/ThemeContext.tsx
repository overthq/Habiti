import React from 'react';
import { useColorScheme } from 'react-native';
import useStore from '../state';
import { ThemeObject, themes } from '../styles/theme';

export const ThemeContext = React.createContext<ThemeObject | null>(null);

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const theme = useStore(({ theme }) => theme);
	const autoTheme = useColorScheme();

	const parsed = React.useMemo(() => {
		return theme === 'auto' ? autoTheme ?? 'light' : theme;
	}, [theme, autoTheme]);

	const themeObject = React.useMemo(() => {
		return themes[parsed];
	}, [parsed]);

	return (
		<ThemeContext.Provider value={themeObject}>
			{children}
		</ThemeContext.Provider>
	);
};
