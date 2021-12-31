import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][-1];
}

const OrderProduct: React.FC<OrderProductProps> = ({ orderProduct }) => {
	const { product, quantity, unitPrice } = orderProduct;
	const totalPrice = unitPrice ? quantity * unitPrice : 0;

	return (
		<View>
			<View style={styles.placeholder}>
				{product.images[0] && (
					<Image
						source={{ uri: product.images[0].path }}
						style={styles.image}
					/>
				)}
			</View>
			<Text style={styles.text}>{product.name}</Text>
			<Text style={styles.text}>
				{quantity} - {totalPrice} NGN
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	placeholder: {
		height: 50,
		width: 50,
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	text: {
		fontSize: 16
	}
});

export default OrderProduct;
