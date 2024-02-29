import { CustomImage, Typography } from '@market/components';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { WatchlistQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface WatchlistProductProps {
	onPress(): void;
	product: WatchlistQuery['currentUser']['watchlist'][-1]['product'];
}

const WatchlistProduct: React.FC<WatchlistProductProps> = ({
	product,
	onPress
}) => {
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<CustomImage
				uri={product.images[0]?.path}
				width={160}
				height={160}
				style={styles.image}
			/>
			<Typography weight='medium' numberOfLines={1}>
				{product.name}
			</Typography>
			<Typography variant='secondary'>
				{formatNaira(product.unitPrice)}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		marginLeft: 16,
		width: 160
	},
	image: {
		marginBottom: 8
	},
	status: {
		fontSize: 14,
		color: '#7dba03',
		fontWeight: '500'
	}
});

export default WatchlistProduct;
