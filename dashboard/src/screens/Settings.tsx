import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Settings: React.FC = () => {
	// Settings for:
	// - Theme
	// - Active store

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
