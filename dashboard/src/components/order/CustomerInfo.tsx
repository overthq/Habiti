import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomerInfo: React.FC = () => {
	return (
		<View>
			<Text style={styles.header}>Customer</Text>
			<Text style={styles.name}></Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	header: {},
	name: {
		fontSize: 16
	}
});

export default CustomerInfo;
