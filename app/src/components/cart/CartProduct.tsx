import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CartQuery } from '../../types/api';
import { Icon } from '../icons';

interface CartProductProps {
	cartProduct: CartQuery['cart']['products'][-1];
}

const CartProduct: React.FC<CartProductProps> = ({
	cartProduct: { product, quantity }
}) => {
	console.log({ product, quantity });

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row' }}>
				<View style={styles.imagePlaceholder}>
					{product.images[0] && (
						<Image
							source={{ uri: product.images[0].path }}
							style={{ width: '100%', height: '100%' }}
						/>
					)}
				</View>
				<View>
					<Text style={styles.name}>{product.name}</Text>
					<Text style={styles.price}>
						{quantity} {product.unitPrice} NGN
					</Text>
				</View>
			</View>
			<Icon name='chevronRight' color='#D3D3D3' />
		</View>
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
		height: 50,
		width: 50,
		marginRight: 8,
		borderRadius: 4,
		backgroundColor: '#D3D3D3'
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
