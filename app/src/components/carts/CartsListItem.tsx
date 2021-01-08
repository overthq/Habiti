import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { useStoreQuery } from '../../types/api';
import { Cart } from '../../contexts/CartsContext';
import { Icon } from '../icons';
import { stores } from '../../api';

const CartsListItem: React.FC<{ cart: Cart }> = ({ cart }) => {
	// const [{ data }] = useStoreQuery({ variables: { storeId: cart.storeId } });
	const { navigate } = useNavigation();

	const store = stores.find(({ id }) => cart.storeId === id);
	if (!store) throw new Error('Not specified');

	return (
		<TouchableOpacity
			onPress={() => navigate('Cart', { storeId: cart.storeId })}
			activeOpacity={0.8}
			style={styles.container}
		>
			<View style={styles.main}>
				<View style={styles.storeImagePlaceholder}>
					<Image style={styles.storeImage} source={{ uri: store.avatarUrl }} />
				</View>
				<View>
					<Text style={styles.cartStoreName}>{store?.name}</Text>
					<Text style={styles.cartItemCount}>
						{cart.items.length} {`item${cart.items.length > 1 ? 's' : ''}`}
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
