import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../types/navigation';

const CustomerInfo: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	console.log(params.userId);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Customer Information</Text>
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
