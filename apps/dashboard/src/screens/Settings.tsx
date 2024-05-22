import { Button, ScrollableScreen } from '@market/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import SettingRow from '../components/settings/SettingRow';
import useGoBack from '../hooks/useGoBack';
import useStore from '../state';
import { useStoreQuery } from '../types/api';
import type { SettingsStackParamList } from '../types/navigation';
import { capitalize } from '../utils/strings';

const Settings: React.FC = () => {
	const { theme, logOut, setPreference } = useStore(state => ({
		theme: state.theme,
		logOut: state.logOut,
		setPreference: state.setPreference
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

	const handleLogout = () => {
		logOut();
		setPreference({ activeStore: null });
	};

	const store = data?.currentStore;

	return (
		<ScrollableScreen>
			<SettingRow
				name='Active Store'
				onPress={handleSettingsNavigate('SettingsActiveStore')}
				displayValue={store?.name}
			/>
			<SettingRow
				name='Theme'
				onPress={handleSettingsNavigate('SettingsTheme')}
				displayValue={capitalize(theme)}
			/>
			<View style={styles.buttonContainer}>
				<Button text='Log Out' onPress={handleLogout} />
			</View>
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		marginVertical: 16,
		paddingHorizontal: 16
	}
});

export default Settings;
