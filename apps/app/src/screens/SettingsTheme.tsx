import { Screen, SelectGroup, Spacer, Typography } from '@habiti/components';
import React from 'react';

import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useShallow } from 'zustand/shallow';

type Theme = 'light' | 'dark' | 'auto';

const SettingsTheme = () => {
	const { theme, setPreference } = useStore(
		useShallow(state => ({
			theme: state.theme,
			setPreference: state.setPreference
		}))
	);

	const handleThemeSelect = React.useCallback((theme: Theme) => {
		setPreference({ theme });
	}, []);

	useGoBack();

	return (
		<Screen style={{ padding: 16 }}>
			<Typography weight='medium'>Theme</Typography>
			<Spacer y={8} />

			<SelectGroup
				selected={theme}
				options={[
					{ title: 'Light', value: 'light' },
					{ title: 'Dark', value: 'dark' },
					{ title: 'Auto', value: 'auto' }
				]}
				onSelect={handleThemeSelect}
			/>
		</Screen>
	);
};

export default SettingsTheme;
