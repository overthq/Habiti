import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const [{ data }] = useOrderQuery({ variables: { orderId } });
	const order = data?.orders[0];

	if (!order) throw new Error('This order does not exist');

	return (
		<SafeAreaView style={styles.container}>
			<Text>{order.status}</Text>
			<View />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
