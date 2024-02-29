import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { StoresQuery } from '../../types/api';

interface TrendingStoresItemProps {
	store: StoresQuery['stores'][number];
	onPress(): void;
}

const TrendingStoresItem: React.FC<TrendingStoresItemProps> = ({
	store,
	onPress
}) => (
	<Pressable style={styles.container} onPress={onPress}>
		<CustomImage
			uri={store.image?.path}
			height={70}
			width={70}
			style={styles.image}
		/>
		<Typography style={styles.name}>{store.name}</Typography>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		marginRight: 16
	},
	image: {
		borderRadius: 35
	},
	name: {
		marginTop: 4,
		textAlign: 'center'
	}
});

export default TrendingStoresItem;
