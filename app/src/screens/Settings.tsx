import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Settings: React.FC = () => {
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
