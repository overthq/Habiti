import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';
import {
	useAddItemToCartMutation,
	useCreateCartMutation
} from '../../types/api';
import { useAppSelector } from '../../redux/store';

interface AddToCartProps {
	storeId: string;
	itemId: string;
	cartId?: string | null;
}

// FIXME: The API-related logic here stinks.
// Someone with a better knowledge of relational databases
// should be able to design a system where we can do this with less conditionals and all.

const AddToCart: React.FC<AddToCartProps> = ({ storeId, itemId, cartId }) => {
	const userId = useAppSelector(({ auth }) => auth.userId);
	const [, addItemToCart] = useAddItemToCartMutation();
	const [, createCart] = useCreateCartMutation();

	const handlePress = async () => {
		if (cartId) {
			await addItemToCart({
				object: { cart_id: cartId, item_id: itemId, quantity: 1 }
			});
		} else {
			const { data } = await createCart({
				object: { user_id: userId, store_id: storeId }
			});

			const newCartId = data?.insert_carts_one?.id;
			await addItemToCart({
				object: { cart_id: newCartId, item_id: itemId, quantity: 1 }
			});
		}
	};

	return (
		<TouchableOpacity style={styles.button} onPress={handlePress}>
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
