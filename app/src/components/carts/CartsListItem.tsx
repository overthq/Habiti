import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStoreQuery } from '../../types';
import { Cart } from '../../contexts/CartsContext';
import { Icon } from '../icons';

const CartsListItem: React.FC<{ cart: Cart }> = ({ cart }) => {
	const [{ data }] = useStoreQuery({ variables: { storeId: cart.storeId } });
	const { navigate } = useNavigation();

	return (
		<TouchableOpacity
			onPress={() => navigate('Cart', { storeId: cart.storeId })}
			activeOpacity={0.8}
			style={styles.container}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={styles.storeImagePlaceholder} />
				<View>
					<Text style={styles.cartStoreName}>{data?.store.name}</Text>
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
	storeImagePlaceholder: {
		width: 60,
		height: 60,
		marginRight: 10,
		backgroundColor: '#D3D3D3',
		borderRadius: 30
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
