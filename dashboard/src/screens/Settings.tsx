import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
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

	const settings = [
		{
			name: 'Active Store',
			screen: 'SettingsActiveStore',
			displayValue: store?.name
		},
		{
			name: 'Theme',
			screen: 'SettingsTheme',
			displayValue: theme === 'light' ? 'Light' : 'Dark'
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
						onPress={logOut}
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
