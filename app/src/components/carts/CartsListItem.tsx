import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartsQuery } from '../../types/api';
import { Icon } from '../Icon';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../types/navigation';

interface CartListItemProps {
	cart: CartsQuery['currentUser']['carts'][-1];
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
				<View style={styles.placeholder}>
					{cart.store.image && (
						<Image
							style={styles.image}
							source={{ uri: cart.store.image.path }}
						/>
					)}
				</View>
				<View>
					<Text style={styles.name}>{cart.store.name}</Text>
					<Text style={styles.count}>
						{cart.products.length}{' '}
						{`product${cart.products.length > 1 ? 's' : ''}`}
					</Text>
				</View>
			</View>
			<Icon name='chevron-right' size={24} color='#777777' />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 4,
		paddingHorizontal: 16
		// borderBottomWidth: 1,
		// borderBottomColor: '#dedcdc'
	},
	main: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	placeholder: {
		width: 50,
		height: 50,
		overflow: 'hidden',
		marginRight: 10,
		backgroundColor: '#D3D3D3',
		borderRadius: 30
	},
	image: {
		height: '100%',
		width: '100%'
	},
	name: {
		fontSize: 16,
		fontWeight: '500'
	},
	count: {
		fontSize: 14,
		color: '#505050'
	}
});

export default CartsListItem;
