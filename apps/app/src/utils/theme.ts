export enum ThemeMap {
	light = 'Light',
	dark = 'Dark',
	auto = 'Auto'
}

export const getStatusBarStyle = (theme: 'light' | 'dark') => {
	return ({ light: 'dark', dark: 'light' } as const)[theme];
};
