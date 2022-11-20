import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useAddToCartMutation } from '../../types/api';
import { AppStackParamList } from '../../types/navigation';
import Button from '../global/Button';
import QuantityControl from './QuantityControl';

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
	const [, addToCart] = useAddToCartMutation();

	const handlePress = async () => {
		await addToCart({
			input: { storeId, productId, quantity: 1 }
		});
	};

	const renderButton = React.useMemo(() => {
		if (!cartId || (cartId && !inCart)) {
			return (
				<Button
					onPress={handlePress}
					text='Add to cart'
					disabled={inCart}
					style={styles.button}
				/>
			);
		} else {
			return (
				<Button
					text='View in cart'
					onPress={() => navigate('Cart', { cartId })}
					style={styles.button}
				/>
			);
		}
	}, [cartId, inCart]);

	return (
		<View style={styles.container}>
			<QuantityControl productId={productId} />
			{renderButton}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 16,
		marginVertical: 16
	},
	button: {
		flexGrow: 1,
		width: undefined
	}
});

export default AddToCart;
