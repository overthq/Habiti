import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Avatar,
	Row,
	SectionHeader,
	Spacer,
	Typography
} from '@habiti/components';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { formatNaira } from '@habiti/common';

import { relativeTimestamp } from '../../utils/date';
import { plural } from '../../utils/strings';

import type { Order } from '../../data/types';
import type {
	HomeStackParamList,
	MainTabParamList
} from '../../navigation/types';

interface RecentOrdersProps {
	orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
	const { navigate } =
		useNavigation<NavigationProp<MainTabParamList & HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (!orders || orders.length === 0) return null;

	return (
		<View>
			<SectionHeader
				title='Recent orders'
				padded
				action={{
					text: 'View all',
					onPress: () => navigate('Home.Orders')
				}}
			/>
			<Spacer y={4} />
			{orders.slice(0, 3).map(order => (
				<RecentOrder
					key={order.id}
					order={order}
					onPress={handleOrderPress(order.id)}
				/>
			))}
		</View>
	);
};

interface RecentOrderProps {
	order: Order;
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

export default RecentOrders;
