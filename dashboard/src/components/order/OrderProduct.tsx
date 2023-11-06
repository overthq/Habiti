import React from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';
import Typography from '../global/Typography';

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
			<Typography style={styles.name}>{product.name}</Typography>
			<Typography style={styles.price}>
				{plural('unit', quantity)} · {formatNaira(quantity * unitPrice)}
			</Typography>
		</View>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		marginRight: 8
	},
	placeholder: {
		height: 200,
		width: 150,
		backgroundColor: '#D3D3D3',
		borderRadius: 6,
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
		fontSize: 16,
		color: '#505050'
	}
});

export default OrderProduct;
