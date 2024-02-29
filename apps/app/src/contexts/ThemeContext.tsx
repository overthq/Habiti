import React from 'react';
import { useColorScheme } from 'react-native';
import useStore from '../state';
import { ThemeObject, themes } from '../styles/theme';

interface ThemeContextValue {
	name: 'light' | 'dark';
	theme: ThemeObject;
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const theme = useStore(({ theme }) => theme);
	const autoTheme = useColorScheme();

	const parsed = React.useMemo(() => {
		return theme === 'auto' ? autoTheme ?? 'light' : theme;
	}, [theme, autoTheme]);

	const context = React.useMemo(
		() => ({ name: parsed, theme: themes[parsed] }),
		[parsed]
	);

	return (
		<ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
	);
};
