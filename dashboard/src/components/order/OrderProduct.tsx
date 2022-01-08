import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][-1];
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => {
	const total = quantity * unitPrice;

	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={styles.placeholder}>
				{product.images[0] && (
					<Image
						source={{ uri: product.images[0].path }}
						style={styles.image}
					/>
				)}
			</View>
			<View>
				<Text style={styles.name}>{product.name}</Text>
				<Text style={styles.price}>
					{quantity} - {total} NGN
				</Text>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#EDEDED',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4
	},
	placeholder: {
		height: 50,
		width: 50,
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		overflow: 'hidden',
		marginRight: 16
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		fontWeight: '500'
	},
	price: {
		fontSize: 14,
		color: '#505050'
	}
});

export default OrderProduct;