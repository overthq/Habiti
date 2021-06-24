import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../redux/store';

const Settings: React.FC = () => {
	const preferences = useAppSelector(({ preferences }) => preferences);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Settings</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {},
	title: {}
});

export default Settings;
