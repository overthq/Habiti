import React from 'react';
import { View, Pressable, Text, Image, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';
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
					<Image
						source={{ uri: product.images[0]?.path }}
						style={styles.image}
					/>
				</View>
				<View>
					<Text style={styles.name}>{product.name}</Text>
					<Text style={styles.price}>
						{`${plural('unit', quantity)} · `}
						{formatNaira(quantity * unitPrice)}
					</Text>
				</View>
			</View>
			<Icon name='chevron-right' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		paddingVertical: 4
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
		fontSize: 16
	},
	price: {
		fontSize: 16,
		marginTop: 4,
		color: '#777777'
	}
});

export default OrderProduct;
