import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	const order = data?.order;

	if (fetching || !order) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text>Order Details:</Text>
			<Text>{order.id}</Text>
			<Text>{order.createdAt}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	}
});

export default Order;
