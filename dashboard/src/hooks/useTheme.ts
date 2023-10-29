import React from 'react';
import useStore from '../state';
import { themes } from '../styles/theme';
import { Appearance, ColorSchemeName } from 'react-native';

// TODO: In the future, if this hook degrades performance,
// we should find a way to do it directly in Zustand,
// or hoist it into a context provider.

const useTheme = () => {
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
	}, []);

	return themes[parsed];
};

export default useTheme;
