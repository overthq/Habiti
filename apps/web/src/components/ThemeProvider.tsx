import React from 'react';
import { usePreferenceStore } from '@/state/preference-store';

const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	const resolved =
		theme === 'auto'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			: theme;

	if (resolved === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const theme = usePreferenceStore(state => state.theme);

	React.useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	React.useEffect(() => {
		if (theme !== 'auto' || typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const listener = () => applyTheme('auto');
		mq.addEventListener('change', listener);
		return () => mq.removeEventListener('change', listener);
	}, [theme]);

	return <>{children}</>;
};

export default ThemeProvider;
