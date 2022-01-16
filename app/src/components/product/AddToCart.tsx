import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Icon } from '../Icon';
import { useCreateCartMutation, useAddToCartMutation } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import Button from '../global/Button';

interface AddToCartProps {
	storeId: string;
	productId: string;
	cartId?: string | null;
	inCart: boolean;
}

const AddToCart: React.FC<AddToCartProps> = ({
	storeId,
	productId,
	cartId,
	inCart
}) => {
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [, createCart] = useCreateCartMutation();
	const [, addToCart] = useAddToCartMutation();

	const handlePress = async () => {
		if (!cartId) {
			await createCart({ input: { storeId, productId, quantity: 1 } });
		} else {
			await addToCart({
				input: { cartId, productId, quantity: 1 }
			});
		}
	};

	const renderButton = React.useMemo(() => {
		if (!cartId || (cartId && !inCart)) {
			return (
				<Pressable style={styles.button} onPress={handlePress}>
					<Icon
						size={22}
						color='#FFFFFF'
						name='plus'
						style={{ marginRight: 4 }}
					/>
					<Text style={styles.buttonText}>Add to Cart</Text>
				</Pressable>
			);
		} else {
			return (
				<Button
					text='View in cart'
					onPress={() => navigate('Cart', { cartId })}
					style={{ marginVertical: 16 }}
				/>
			);
		}
	}, [cartId, inCart]);

	return <View style={styles.container}>{renderButton}</View>;
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: 16
	},
	button: {
		marginVertical: 16,
		width: '100%',
		height: 45,
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
