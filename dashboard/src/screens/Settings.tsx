import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/store';

const Settings: React.FC = () => {
	// Settings for:
	// - Theme
	// - Active store

	const preferences = useAppSelector(({ preferences }) => preferences);

	return (
		<View style={styles.container}>
			<View>
				<Text>Settings</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Settings;
