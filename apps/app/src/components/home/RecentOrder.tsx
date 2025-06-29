import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Row, Spacer, Typography } from '@habiti/components';
import { formatNaira } from '@habiti/common';

import { HomeQuery } from '../../types/api';
import { relativeTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

interface RecentOrderProps {
	order: HomeQuery['currentUser']['orders'][number];
	onPress(): void;
}

const RecentOrder: React.FC<RecentOrderProps> = ({ order, onPress }) => {
	return (
		<Row key={order.id} style={styles.container} onPress={onPress}>
			<Avatar
				uri={order.store.image?.path}
				size={48}
				circle
				fallbackText={order.store.name}
			/>
			<View style={styles.info}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Typography weight='medium' size='large'>
						{order.store.name}
					</Typography>
					<Typography size='small' variant='secondary'>
						{` · ${relativeTimestamp(order.createdAt)}`}
					</Typography>
				</View>
				<Spacer y={4} />
				<Typography size='small' variant='secondary'>
					{formatNaira(order.total)} ·{' '}
					{plural('product', order.products.length)}
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
		marginLeft: 8
	}
});

export default RecentOrder;
