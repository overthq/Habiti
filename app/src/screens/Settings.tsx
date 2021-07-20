import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import { logOut } from '../redux/auth/actions';
import { useAppSelector } from '../redux/store';

const { width } = Dimensions.get('screen');

const Settings: React.FC = () => {
	const preferences = useAppSelector(({ preferences }) => preferences);
	const dispatch = useDispatch();

	const settings = [
		{
			name: 'Theme',
			screen: 'SettingsTheme',
			display: preferences.theme === 'light' ? 'Light' : 'Dark'
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
						displayValue={item.display}
					/>
				)}
				ListFooterComponent={
					<Button
						text='Log Out'
						onPress={() => dispatch(logOut())}
						style={styles.logOut}
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	logOut: {
		alignSelf: 'center',
		width: width - 16,
		marginVertical: 8
	}
});

export default Settings;
