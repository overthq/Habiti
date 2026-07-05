import React from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import {
	Avatar,
	Row,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { FlashList } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';

import { useOrdersQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import { plural } from '../utils/strings';
import { relativeTimestamp } from '../utils/date';

import type { Order } from '../data/types';
import type { HomeStackScreenProps } from '../navigation/types';

const Orders: React.FC<HomeStackScreenProps<'Home.Orders'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = useOrdersQuery();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigation.navigate('Home.Order', { orderId });
		},
		[navigation]
	);

	if (isLoading && !data) return <View />;

	return (
		<Screen>
			<FlashList
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
				style={{ marginHorizontal: -16 }}
				keyExtractor={item => item.id}
				contentContainerStyle={{ backgroundColor: theme.screen.background }}
				data={data?.orders}
				renderItem={({ item }) => (
					<OrdersListItem order={item} onPress={handleOrderPress(item.id)} />
				)}
			/>
		</Screen>
	);
};

interface OrdersListItemProps {
	order: Order;
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
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

export default Orders;
