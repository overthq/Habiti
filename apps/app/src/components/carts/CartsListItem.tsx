import { CustomImage, Icon, Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { CartsQuery } from '../../types/api';
import { plural } from '../../utils/strings';

interface CartListItemProps {
	cart: CartsQuery['currentUser']['carts'][number];
	onPress(): void;
}

const CartsListItem: React.FC<CartListItemProps> = ({ cart, onPress }) => (
	<Pressable onPress={onPress} style={styles.container}>
		<View style={styles.main}>
			<CustomImage uri={cart.store.image?.path} style={styles.image} />
			<View>
				<Typography weight='medium'>{cart.store.name}</Typography>
				<Typography size='small' variant='secondary'>
					{plural('product', cart.products.length)}
				</Typography>
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
	image: {
		marginRight: 10,
		borderRadius: 30
	}
});

export default CartsListItem;
