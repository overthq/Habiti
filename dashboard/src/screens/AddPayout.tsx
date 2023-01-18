import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';

const AddPayout: React.FC = () => {
	useGoBack();

	return (
		<View style={styles.container}>
			<Text>Add Payout</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default AddPayout;
