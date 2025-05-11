import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomImage, Row, Typography } from '@habiti/components';

import { HomeQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';
import { formatNaira } from '@habiti/common';

interface RecentOrderProps {
	order: HomeQuery['currentUser']['orders'][number];
	onPress(): void;
}

// TODO: Remove the store name from its prominent spot.
// Replace it with the name of the first item in the order
// Something like: "Nike Air Force 1s + 2 others" (ellipsis necessary).
// (Or maybe the most expensive one?)
// Make the date relative. (e.g. "2 days ago")

const RecentOrder: React.FC<RecentOrderProps> = ({ order, onPress }) => {
	return (
		<Row key={order.id} style={styles.container} onPress={onPress}>
			<CustomImage
				uri={order.store.image?.path}
				height={48}
				width={48}
				circle
			/>
			<View style={styles.info}>
				<Typography weight='medium'>{order.store.name}</Typography>
				<Typography size='small' variant='secondary'>
					{plural('product', order.products.length)} ·{' '}
					{relativeTimestamp(order.createdAt)} · {formatNaira(order.total)}
				</Typography>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	info: {
		// marginTop: 2,
		marginLeft: 8
	}
});

export default RecentOrder;
