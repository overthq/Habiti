import { Icon } from '@market/components';
import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';

import { CartsQuery } from '../../types/api';
import { plural } from '../../utils/strings';

interface CartListItemProps {
	cart: CartsQuery['currentUser']['carts'][number];
	onPress(): void;
}

const CartsListItem: React.FC<CartListItemProps> = ({ cart, onPress }) => (
	<Pressable onPress={onPress} style={styles.container}>
		<View style={styles.main}>
			<View style={styles.placeholder}>
				<Image style={styles.image} source={{ uri: cart.store.image?.path }} />
			</View>
			<View>
				<Text style={styles.name}>{cart.store.name}</Text>
				<Text style={styles.count}>
					{plural('product', cart.products.length)}
				</Text>
			</View>
		</View>
		<Icon name='chevron-right' size={24} color='#777777' />
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
		paddingHorizontal: 16
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
