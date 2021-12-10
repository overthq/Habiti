import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';
import OrderItem from '../components/order/OrderItem';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const [{ data }] = useOrderQuery({ variables: { id: orderId } });
	const order = data?.order;

	if (!order) throw new Error('This order does not exist');

	return (
		<SafeAreaView style={styles.container}>
			<Text>{order.user.name}</Text>
			{/* <Text>{order.status}</Text> */}
			<View>
				<Text style={styles.sectionHeader}>Order items</Text>
				{order.products.map(product => (
					<OrderItem key={product.productId} orderItem={product} />
				))}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Order;
