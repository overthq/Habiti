import React from 'react';
import { View, Pressable, Text, Image, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { Icon } from '../Icon';

interface OrderProductProps {
	orderProduct: OrderQuery['order']['products'][-1];
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={styles.left}>
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
					<Text>
						{quantity} x {unitPrice} NGN
					</Text>
				</View>
			</View>
			<Icon name='chevronRight' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderBottomWidth: 0.5,
		borderBottomColor: '#EDEDED'
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	placeholder: {
		borderRadius: 4,
		backgroundColor: '#D3D3D3',
		height: 40,
		width: 40,
		marginRight: 8,
		overflow: 'hidden'
	},
	image: {
		width: '100%',
		height: '100%'
	},
	name: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default OrderProduct;
