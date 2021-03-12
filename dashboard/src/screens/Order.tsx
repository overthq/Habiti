import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderQuery, useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';

interface OrderItemProps {
	orderItem: OrderQuery['orders'][-1]['order_items'];
}

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
	const { id, item, quantity, unit_price } = orderItem;

	return (
		<View key={id}>
			<View
				style={{
					height: 50,
					width: 50,
					backgroundColor: '#D3D3D3',
					borderRadius: 4
				}}
			/>
			<Text>{item.name}</Text>
			<Text>
				{quantity} - N{quantity * unit_price}
			</Text>
		</View>
	);
};

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
			<View>
				<Text>Order items</Text>
				{order.order_items.map(orderItem => (
					<OrderItem key={id} orderItem={orderItem} />
				))}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
