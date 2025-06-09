import React from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { ThemeObject, themes } from './styles/theme';

interface ThemeContextValue {
	name: 'light' | 'dark';
	theme: ThemeObject;
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
	theme: 'light' | 'dark' | 'auto';
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	theme,
	children
}) => {
	const autoTheme = useColorScheme();

	const parsed = React.useMemo(() => {
		return theme === 'auto' ? (autoTheme ?? 'light') : theme;
	}, [theme]);

	const context = React.useMemo(
		() => ({ name: parsed, theme: themes[parsed] }),
		[parsed]
	);

	React.useEffect(() => {
		Appearance.setColorScheme(parsed);
	}, [parsed]);

	return (
		<ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = React.useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
