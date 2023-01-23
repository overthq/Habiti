import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import useStore from '../state';
import { useStoreQuery } from '../types/api';
import type { SettingsStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';

const Settings: React.FC = () => {
	const { theme, logOut } = useStore(state => ({
		theme: state.theme,
		logOut: state.logOut
	}));

	const [{ data }] = useStoreQuery();

	const { navigate } = useNavigation<NavigationProp<SettingsStackParamList>>();
	useGoBack('x', 12);

	const handleSettingsNavigate = React.useCallback(
		(screen: keyof SettingsStackParamList) => () => {
			navigate(screen);
		},
		[navigate]
	);

	const store = data?.currentStore;

	return (
		<ScrollView style={styles.container}>
			<SettingRow
				name='Active Store'
				onPress={handleSettingsNavigate('SettingsActiveStore')}
				displayValue={store?.name}
			/>
			<SettingRow
				name='Payouts'
				onPress={handleSettingsNavigate('SettingsPayout')}
			/>
			<SettingRow
				name='Theme'
				onPress={handleSettingsNavigate('SettingsTheme')}
				displayValue={theme === 'light' ? 'Light' : 'Dark'}
			/>
			<View style={styles.buttonContainer}>
				<Button text='Log Out' onPress={logOut} />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	buttonContainer: {
		marginVertical: 16,
		paddingHorizontal: 16
	}
});

export default Settings;
