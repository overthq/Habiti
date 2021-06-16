import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderDetailsItemFragment } from '../../types/api';

interface OrderItemProps {
	orderItem: OrderDetailsItemFragment;
}

const OrderItem: React.FC<OrderItemProps> = ({ orderItem }) => {
	const { item, quantity, unit_price } = orderItem;
	const totalPrice = unit_price ? quantity * unit_price : 0;

	return (
		<View>
			<View style={styles.image} />
			<Text style={styles.text}>{item.name}</Text>
			<Text style={styles.text}>
				{quantity} - {totalPrice} NGN
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	image: {
		height: 50,
		width: 50,
		backgroundColor: '#D3D3D3',
		borderRadius: 4
	},
	text: {
		fontSize: 16
	}
});

export default OrderItem;
