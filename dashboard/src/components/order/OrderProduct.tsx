import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][number];
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<View style={styles.placeholder}>
			<Image source={{ uri: product.images[0]?.path }} style={styles.image} />
		</View>
		<View>
			<Text style={styles.name}>{product.name}</Text>
			<Text style={styles.price}>
				{plural('unit', quantity)} · {formatNaira(quantity * unitPrice)}
			</Text>
		</View>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		marginRight: 16
	},
	placeholder: {
		height: 200,
		width: 150,
		backgroundColor: '#D3D3D3',
		borderRadius: 4,
		overflow: 'hidden',
		marginRight: 8
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		marginTop: 4
	},
	price: {
		fontSize: 14,
		color: '#505050'
	}
});

export default OrderProduct;
