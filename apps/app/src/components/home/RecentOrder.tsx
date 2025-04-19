import { CustomImage, Row, Typography } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { HomeQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

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
				height={56}
				width={56}
				style={styles.image}
			/>
			<View style={styles.info}>
				<Typography weight='medium'>{order.store.name}</Typography>
				<Typography size='small'>
					{plural('product', order.products.length)} ·{' '}
					{relativeTimestamp(order.createdAt)}
				</Typography>
				<Typography size='xsmall' weight='medium' variant='secondary'>
					{order.status}
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
	image: {
		borderRadius: 28
	},
	info: {
		marginLeft: 8
	}
});

export default RecentOrder;
