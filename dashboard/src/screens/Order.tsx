import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { OrdersStackParamsList } from '../types/navigation';
import OrderProduct from '../components/order/OrderProduct';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const [{ data }] = useOrderQuery({ variables: { id: orderId } });
	const order = data?.order;

	return (
		<View style={styles.container}>
			<Text>{order?.user.name}</Text>
			{/* <Text>{order.status}</Text> */}
			<View>
				<Text style={styles.sectionHeader}>Products</Text>
				{order?.products.map(product => (
					<OrderProduct key={product.productId} orderProduct={product} />
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500',
		marginVertical: 8
	}
});

export default Order;
