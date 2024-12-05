import { formatNaira } from '@habiti/common';
import { CustomImage, Spacer, Typography, useTheme } from '@habiti/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CustomerInfoQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

interface OrderDetailProps {
	order: CustomerInfoQuery['user']['orders'][number];
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{ borderBottomWidth: 1, borderColor: theme.border.color }
			]}
		>
			<View style={styles.header}>
				<View style={styles.headerText}>
					<Typography size='small'>
						{parseTimestamp(order.createdAt)}
					</Typography>
					<Typography size='small' variant='secondary' weight='medium'>
						·
					</Typography>
					<Typography size='small' variant='secondary'>
						{plural('item', order.products.length)}
					</Typography>
				</View>
				<Typography size='small' weight='medium'>
					{formatNaira(order.total)}
				</Typography>
			</View>
			<Spacer y={8} />
			<View style={styles.row}>
				{order.products.slice(0, 3).map((product, index) => (
					<View
						key={product.id}
						style={[
							styles.item,
							index === order.products.slice(0, 3).length - 1 && styles.lastItem
						]}
					>
						<CustomImage
							uri={product.product.images[0]?.path}
							height={48}
							width={48}
							style={styles.image}
						/>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	headerText: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	row: {
		flexDirection: 'row'
	},
	item: {
		marginRight: 8
	},
	lastItem: {
		marginRight: 0
	},
	image: {
		borderRadius: 4
	}
});

export default OrderDetail;
