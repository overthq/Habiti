import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Icon } from '../icons';
import { upsertItemToCart } from '../../redux/carts/actions';

interface AddToCartProps {
	storeId: string;
	itemId: string;
}

const AddToCart: React.FC<AddToCartProps> = ({ storeId, itemId }) => {
	const dispatch = useDispatch();

	return (
		<TouchableOpacity
			style={styles.button}
			onPress={() => {
				dispatch(upsertItemToCart({ storeId, itemId }));
			}}
		>
			<Icon size={22} color='#FFFFFF' name='plus' style={{ marginRight: 5 }} />
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
