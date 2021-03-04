import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';
import { logOut } from '../redux/auth/actions';

const Settings: React.FC = () => {
	const preferences = useAppSelector(({ preferences }) => preferences);
	const dispatch = useDispatch();

	const [{ data }] = useStoreQuery({
		variables: { storeId: preferences.activeStore }
	});

	const store = data?.stores_by_pk;

	const settings = [
		{
			name: 'Active Store',
			screenTo: 'SettingsActiveStore',
			displayValue: store?.name
		},
		{
			name: 'Theme',
			screenTo: 'SettingsTheme',
			displayValue: preferences.theme === 'light' ? 'Light' : 'Dark'
		}
	];

	return (
		<View style={styles.container}>
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
			<Button text='Log Out' onPress={() => dispatch(logOut())} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Settings;
