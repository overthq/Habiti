import React from 'react';
import { View } from 'react-native';
import SettingSelectRow from './SettingSelectRow';
import useStore from '../../state';

type Theme = 'light' | 'dark' | 'auto';

const themes: Theme[] = ['light', 'dark'];

const SettingsTheme = () => {
	const { theme, setPreference } = useStore(state => ({
		theme: state.theme,
		setPreference: state.setPreference
	}));

	const handleThemeSelect = (theme: Theme) => {
		setPreference({ theme });
	};

	return (
		<View>
			{themes.map(t => (
				<SettingSelectRow
					key={t}
					name={t[0].toUpperCase() + t.substring(1)}
					isSelected={theme === t}
					onSelectRow={() => handleThemeSelect(t)}
				/>
			))}
		</View>
	);
};

export default SettingsTheme;
