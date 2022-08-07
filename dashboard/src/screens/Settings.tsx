import React from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import useStore from '../state';
import { useStoreQuery } from '../types/api';

const { width } = Dimensions.get('window');

const Settings: React.FC = () => {
	const { theme, activeStore, logOut } = useStore(state => ({
		theme: state.theme,
		activeStore: state.activeStore,
		logOut: state.logOut
	}));

	const [{ data }] = useStoreQuery({
		variables: { storeId: activeStore as string }
	});

	const store = data?.store;

	return (
		<ScrollView style={styles.container}>
			<SettingRow
				name='Active Store'
				screen='SettingsActiveStore'
				displayValue={store?.name}
			/>
			<SettingRow
				name='Theme'
				screen='SettingsTheme'
				displayValue={theme === 'light' ? 'Light' : 'Dark'}
			/>
			<Button
				text='Log Out'
				onPress={logOut}
				style={{
					alignSelf: 'center',
					width: width - 16,
					marginVertical: 8
				}}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Settings;
