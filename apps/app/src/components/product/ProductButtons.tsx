import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../Icon';
import { useAddToWatchlistMutation } from '../../types/api';

interface ProductButtonsProps {
	productId: string;
}

const ProductButtons: React.FC<ProductButtonsProps> = ({ productId }) => {
	const { goBack } = useNavigation();
	const [, addToWatchlist] = useAddToWatchlistMutation();

	const handlePress = async () => {
		await addToWatchlist({ productId });
	};

	return (
		<View style={styles.container}>
			<Pressable style={styles.button} onPress={goBack}>
				<Icon name='x' />
			</Pressable>

			<Pressable style={styles.button} onPress={handlePress}>
				<Icon name='bookmark' />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		width: '100%',
		top: 48,
		paddingHorizontal: 16
	},
	button: {
		height: 32,
		width: 32,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default ProductButtons;
