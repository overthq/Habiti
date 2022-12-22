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
			<Text style={styles.name}>{data.user.name}</Text>
			<Text style={styles.phone}>{data.user.phone}</Text>
			<Text>Previous Orders:</Text>
			{data.user.orders.map(order => (
				<View key={order.id}>
					<Text>{order.total}</Text>
				</View>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	name: {
		fontSize: 24,
		fontWeight: '500'
	},
	phone: {
		fontSize: 16
	}
});

export default CustomerInfo;
