import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
	return (
		<SafeAreaView style={styles.container}>
			<Text>This screen is not currently under development.</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Profile;
