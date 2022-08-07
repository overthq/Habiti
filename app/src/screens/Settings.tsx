import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import useStore from '../state';

const { width } = Dimensions.get('screen');

const Settings: React.FC = () => {
	const { theme, logOut } = useStore(state => ({
		theme: state.theme,
		logOut: state.logOut
	}));

	const settings = [
		{
			name: 'Theme',
			screen: 'SettingsTheme',
			display: theme === 'light' ? 'Light' : 'Dark'
		}
	];

	return (
		<View style={styles.container}>
			<FlashList
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
					<Button text='Log Out' onPress={logOut} style={styles.logOut} />
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
