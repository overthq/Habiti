import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';

interface AddToCartProps {
	storeId: string;
	itemId: string;
}

const AddToCart: React.FC<AddToCartProps> = ({ storeId, itemId }) => {
	// We want to add the currently selected item to the cart, and do nothing else.
	// The user always has a cart with

	return (
		<TouchableOpacity
			style={styles.button}
			onPress={() => {
				// Add item to cart.
				// dispatch(upsertItemToCart({ storeId, itemId }));
			}}
		>
			<Icon size={22} color='#FFFFFF' name='plus' style={{ marginRight: 4 }} />
			<Text style={styles.buttonText}>Add to Cart</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		marginVertical: 10,
		width: '100%',
		height: 40,
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#202020'
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#FFFFFF'
	}
});

export default AddToCart;
