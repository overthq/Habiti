import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { StoreProductsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface StoreListItemProps {
	item: StoreProductsQuery['store']['products'][number];
	onPress(): void;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ item, onPress }) => (
	<Pressable key={item.id} style={styles.pressable} onPress={onPress}>
		<CustomImage height={200} style={styles.image} uri={item.images[0]?.path} />
		<Typography style={styles.name}>{item.name}</Typography>
		<Typography variant='secondary'>{formatNaira(item.unitPrice)}</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	pressable: {
		flex: 1,
		margin: 8
	},
	image: {
		width: '100%',
		marginBottom: 4
	},
	name: {
		marginBottom: 2
	}
});

export default StoreListItem;
