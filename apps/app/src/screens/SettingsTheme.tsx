import { Icon, Screen, Typography, useTheme } from '@market/components';
import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

import useGoBack from '../hooks/useGoBack';
import useStore from '../state';

type Theme = 'light' | 'dark' | 'auto';

const themes: Theme[] = ['light', 'dark', 'auto'];

interface SettingSelectRowProps {
	name: string;
	isSelected: boolean;
	onSelectRow(): void;
}

const SettingSelectRow: React.FC<SettingSelectRowProps> = ({
	name,
	isSelected,
	onSelectRow
}) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[styles.row, { borderBottomColor: theme.border.color }]}
			onPress={onSelectRow}
		>
			<Typography style={{ fontSize: 16 }}>{name}</Typography>
			<View>{isSelected && <Icon name='check' size={22} />}</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: 'transparent',
		borderBottomWidth: 1,
		height: 44
	}
});

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
