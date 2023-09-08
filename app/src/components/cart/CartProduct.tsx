import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { CartQuery } from '../../types/api';
import { Icon } from '../Icon';
import { formatNaira } from '../../utils/currency';
import { plural } from '../../utils/strings';

interface CartProductProps {
	cartProduct: CartQuery['cart']['products'][number];
	onPress(): void;
}

const CartProduct: React.FC<CartProductProps> = ({
	cartProduct: { product, quantity },
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.imagePlaceholder}>
					<Image
						source={{ uri: product.images[0]?.path }}
						style={styles.image}
					/>
				</View>
				<View>
					<Text style={styles.name}>{product.name}</Text>
					<Text style={styles.price}>
						{`${plural('unit', quantity)} · ${formatNaira(
							product.unitPrice * quantity
						)}`}
					</Text>
				</View>
			</View>
			<Icon name='chevron-right' color='#505050' />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 4
	},
	imagePlaceholder: {
		height: 40,
		width: 40,
		marginRight: 8,
		borderRadius: 4,
		backgroundColor: '#D3D3D3',
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

export default CartProduct;
