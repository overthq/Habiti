import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartDetailsFragment } from '../../types/api';
import { Icon } from '../icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../types/navigation';

interface CartListItemProps {
	cart: CartDetailsFragment;
}

const CartsListItem: React.FC<CartListItemProps> = ({ cart }) => {
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	return (
		<TouchableOpacity
			onPress={() => navigate('Cart', { cartId: cart.id })}
			activeOpacity={0.8}
			style={styles.container}
		>
			<View style={styles.main}>
				<View style={styles.storeImagePlaceholder}>
					<Image style={styles.storeImage} source={{ uri: '' }} />
				</View>
				<View>
					<Text style={styles.cartStoreName}>{cart.store.name}</Text>
					<Text style={styles.cartItemCount}>
						{cart.cart_items.length}{' '}
						{`item${cart.cart_items.length > 1 ? 's' : ''}`}
					</Text>
				</View>
			</View>
			<Icon name='chevronRight' size={24} color='#777777' />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	main: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	storeImagePlaceholder: {
		width: 60,
		height: 60,
		overflow: 'hidden',
		marginRight: 10,
		backgroundColor: '#D3D3D3',
		borderRadius: 30
	},
	storeImage: {
		height: '100%',
		width: '100%'
	},
	cartStoreName: {
		fontSize: 18,
		fontWeight: '500'
	},
	cartItemCount: {
		fontSize: 16,
		color: '#505050'
	}
});

export default CartsListItem;
