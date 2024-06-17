import { formatNaira } from '@habiti/common';
import { CustomImage, Typography } from '@habiti/components';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { StoreProductsQuery } from '../../types/api';

interface StoreListItemProps {
	item: StoreProductsQuery['store']['products'][number];
	onPress(): void;
	side: 'left' | 'right';
}

const StoreListItem: React.FC<StoreListItemProps> = ({
	item,
	onPress,
	side
}) => (
	<Pressable
		key={item.id}
		style={[
			styles.pressable,
			{ [side === 'left' ? 'marginLeft' : 'marginRight']: 16 }
		]}
		onPress={onPress}
	>
		<CustomImage height={200} style={styles.image} uri={item.images[0]?.path} />
		<Typography weight='medium'>{item.name}</Typography>
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
		marginBottom: 8
	}
});

export default StoreListItem;
