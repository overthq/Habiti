import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import { useAppSelector } from '../redux/store';
import { useStoreQuery } from '../types/api';
import { logOut } from '../redux/auth/actions';

const { width } = Dimensions.get('window');

const Settings: React.FC = () => {
	const preferences = useAppSelector(({ preferences }) => preferences);
	const dispatch = useDispatch();

	const [{ data }] = useStoreQuery({
		variables: { storeId: preferences.activeStore as string }
	});

	const store = data?.store;

	const settings = [
		{
			name: 'Active Store',
			screen: 'SettingsActiveStore',
			displayValue: store?.name
		},
		{
			name: 'Theme',
			screen: 'SettingsTheme',
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
						screen={item.screen}
						displayValue={item.displayValue}
					/>
				)}
				ListFooterComponent={
					<Button
						text='Log Out'
						onPress={() => dispatch(logOut())}
						style={{
							alignSelf: 'center',
							width: width - 16,
							marginVertical: 8
						}}
					/>
				}
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
