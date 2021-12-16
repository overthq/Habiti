import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Icon } from '../icons';
import { useAddProductToCartMutation } from '../../types/api';

interface AddToCartProps {
	storeId: string;
	productId: string;
	cartId?: string | null;
}

const AddToCart: React.FC<AddToCartProps> = ({
	storeId,
	productId,
	cartId
}) => {
	const [, addProductToCart] = useAddProductToCartMutation();

	const handlePress = async () => {
		await addProductToCart({
			input: { storeId, cartId, productId, quantity: 1 }
		});
	};

	return (
		<View style={{ width: '100%', paddingHorizontal: 16 }}>
			<Pressable style={styles.button} onPress={handlePress}>
				<Icon
					size={22}
					color='#FFFFFF'
					name='plus'
					style={{ marginRight: 4 }}
				/>
				<Text style={styles.buttonText}>Add to Cart</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		marginVertical: 10,
		marginHorizontal: 16,
		width: '100%',
		height: 40,
		borderRadius: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#202020'
	},
	buttonText: {
		fontSize: 17,
		fontWeight: '500',
		color: '#FFFFFF'
	}
});

export default AddToCart;
