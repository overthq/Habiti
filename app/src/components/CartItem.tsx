import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useItemQuery } from '../types/api';

interface CartItemProps {
	itemId: string;
	quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ itemId, quantity }) => {
	const [{ data }] = useItemQuery({ variables: { itemId } });
	const item = data?.items_by_pk;

	if (!item) throw new Error('This item does not exist');

	return (
		<View style={styles.container}>
			<View style={styles.imagePlaceholder} />
			<View>
				<Text style={styles.name}>{item.name}</Text>
				<Text style={styles.price}>
					{quantity} {item.unit_price}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 5
	},
	imagePlaceholder: {
		height: 50,
		width: 50,
		marginRight: 10,
		borderRadius: 8,
		backgroundColor: '#D3D3D3'
	},
	name: {
		fontSize: 16
	},
	price: {
		fontSize: 14,
		marginTop: 8
	}
});

export default CartItem;
