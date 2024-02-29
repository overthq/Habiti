import { Screen } from '@market/components';
import React from 'react';

import SettingSelectRow from './SettingSelectRow';
import useGoBack from '../../hooks/useGoBack';
import useStore from '../../state';

type Theme = 'light' | 'dark' | 'auto';

const themes: Theme[] = ['light', 'dark', 'auto'];

// TODO: Move this into the "screens" folder.
const SettingsTheme = () => {
	const { theme, setPreference } = useStore(state => ({
		theme: state.theme,
		setPreference: state.setPreference
	}));

	const handleThemeSelect = React.useCallback(
		(theme: Theme) => () => {
			setPreference({ theme });
		},
		[]
	);

	useGoBack();

	return (
		<Screen>
			{themes.map(t => (
				<SettingSelectRow
					key={t}
					name={t[0].toUpperCase() + t.substring(1)}
					isSelected={theme === t}
					onSelectRow={handleThemeSelect(t)}
				/>
			))}
		</Screen>
	);
};

export default SettingsTheme;
