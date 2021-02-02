import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SettingRow from '../components/settings/SettingRow';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';

const Settings: React.FC = () => {
	const preferences = useAppSelector(({ preferences }) => preferences);

	const [{ data }] = useStoreQuery({
		variables: { storeId: preferences.activeStore }
	});

	const store = data?.stores[0];

	const settings = [
		{
			name: 'Active Store',
			screenTo: 'SettingsActiveStore',
			displayValue: store.name
		},
		{
			name: 'Theme',
			screenTo: 'SettingsTheme',
			displayValue: preferences.theme === 'light' ? 'Light' : 'dark' // Or just capitalize the string
		}
	];

	return (
		<View style={styles.container}>
			<View>
				<Text>Settings</Text>
			</View>
			<FlatList
				data={settings}
				keyExtractor={s => s.name}
				renderItem={({ item }) => (
					<SettingRow
						name={item.name}
						screenTo={item.screenTo}
						displayValue={item.displayValue}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Settings;
