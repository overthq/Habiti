import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import ScrollableScreen from '../components/global/ScrollableScreen';
import SettingRow from '../components/settings/SettingRow';
import Button from '../components/global/Button';
import useStore from '../state';
import { useStoreQuery } from '../types/api';
import useGoBack from '../hooks/useGoBack';
import { capitalize } from '../utils/strings';
import type { SettingsStackParamList } from '../types/navigation';

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
				<Button text='Log Out' onPress={logOut} />
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
