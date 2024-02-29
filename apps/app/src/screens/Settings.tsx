import { Button } from '@market/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import SettingRow from '../components/settings/SettingRow';
import useStore from '../state';
import { ThemeMap } from '../utils/theme';

const Settings: React.FC = () => {
	const { theme, logOut } = useStore(state => ({
		theme: state.theme,
		logOut: state.logOut
	}));
	const { navigate } = useNavigation<StackNavigationProp<any>>();

	const handleRowNavigate = React.useCallback(
		(screen: string) => () => {
			navigate(screen);
		},
		[]
	);

	return (
		<ScrollView style={styles.container}>
			<SettingRow
				name='Theme'
				onPress={handleRowNavigate('SettingsTheme')}
				displayValue={ThemeMap[theme]}
			/>

			<Button text='Log Out' onPress={logOut} style={styles.logOut} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	logOut: {
		margin: 8
	}
});

export default Settings;
