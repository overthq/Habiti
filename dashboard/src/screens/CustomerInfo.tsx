import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import useGoBack from '../hooks/useGoBack';
import { useCustomerInfoQuery } from '../types/api';
import type { AppStackParamList } from '../types/navigation';

const CustomerInfo: React.FC = () => {
	const { params } = useRoute<RouteProp<AppStackParamList, 'CustomerInfo'>>();
	const [{ data, fetching }] = useCustomerInfoQuery({
		variables: { userId: params.userId }
	});

	useGoBack('x');

	if (fetching || !data) {
		return <View />;
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Customer Information</Text>
			<Text style={styles.name}>{data.user.name}</Text>
			<Text style={styles.phone}>{data.user.phone}</Text>
			<Text>Previous Orders</Text>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	header: {},
	name: {
		fontSize: 16
	},
	phone: {
		fontSize: 16
	}
});

export default CustomerInfo;
