import React from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import Button from '../components/global/Button';
import SettingRow from '../components/settings/SettingRow';
import useStore from '../state';
import { ThemeMap } from '../utils/theme';

const { width } = Dimensions.get('screen');

const Settings: React.FC = () => {
	const { theme, logOut } = useStore(state => ({
		theme: state.theme,
		logOut: state.logOut
	}));

	return (
		<ScrollView style={styles.container}>
			<SettingRow
				name='Theme'
				screen='SettingsTheme'
				displayValue={ThemeMap[theme]}
			/>

			<Button text='Log Out' onPress={logOut} style={styles.logOut} />
		</ScrollView>
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
