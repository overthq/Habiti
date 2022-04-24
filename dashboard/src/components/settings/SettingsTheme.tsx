import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { updatePreference } from '../../redux/preferences/actions';
import { useAppSelector } from '../../redux/store';
import SettingSelectRow from './SettingSelectRow';
import type { Theme } from '../../redux/preferences/types';

const themes: Theme[] = ['light', 'dark'];

const SettingsTheme = () => {
	const theme = useAppSelector(({ preferences }) => preferences.theme);
	const dispatch = useDispatch();

	const handleThemeSelect = (theme: Theme) => {
		dispatch(updatePreference({ theme }));
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
