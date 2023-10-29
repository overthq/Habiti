import React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import useStore from '../state';
import { ThemeObject, themes } from '../styles/theme';

export const ThemeContext = React.createContext<ThemeObject | null>(null);

interface ThemeProviderProps {
	children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const theme = useStore(({ theme }) => theme);
	const [autoTheme, setAutoTheme] = React.useState<ColorSchemeName>(null);

	React.useEffect(() => {
		const themeListener = Appearance.addChangeListener(({ colorScheme }) => {
			setAutoTheme(colorScheme);
		});

		return () => {
			themeListener.remove();
		};
	}, []);

	const parsed = React.useMemo(() => {
		return theme === 'auto' ? autoTheme ?? 'light' : theme;
	}, [theme]);

	const themeObject = React.useMemo(() => {
		return themes[parsed];
	}, [parsed]);

	return (
		<ThemeContext.Provider value={themeObject}>
			{children}
		</ThemeContext.Provider>
	);
};
