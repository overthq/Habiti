import React from 'react';
import {
	ActivityIndicator,
	View,
	RefreshControl,
	StyleSheet
} from 'react-native';
import { Row, Spacer, Icon, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';

import { useOrdersContext } from './OrdersContext';

import { relativeDate } from '../../utils/date';
import { ORDER_STATUS_LABELS } from '../../utils/orderStatus';

import type { OrdersStackParamList } from '../../navigation/types';
import type { Order } from '../../data/types';
import { useOrdersFilterStore } from '../../state/filters';

const OrdersList = () => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const { orders, isLoading, refreshing, refresh } = useOrdersContext();
	const { filters } = useOrdersFilterStore();
	const { theme } = useTheme();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[navigate]
	);

	const renderOrder: ListRenderItem<Order> = React.useCallback(
		({ item }) => {
			return (
				<OrdersListItem onPress={handleOrderPress(item.id)} order={item} />
			);
		},
		[handleOrderPress]
	);

	const refreshControl = React.useMemo(
		() => (
			<RefreshControl
				refreshing={refreshing}
				onRefresh={refresh}
				tintColor={theme.text.secondary}
			/>
		),
		[refreshing, refresh, theme.text.secondary]
	);

	return (
		<View style={{ flex: 1 }}>
			<FlashList
				keyExtractor={i => i.id}
				data={orders}
				renderItem={renderOrder}
				style={{ marginHorizontal: -16 }}
				contentContainerStyle={{
					flexGrow: 1,
					backgroundColor: theme.screen.background
				}}
				ListEmptyComponent={
					isLoading ? (
						<View style={styles.empty}>
							<ActivityIndicator color={theme.text.secondary} />
						</View>
					) : (
						<View style={styles.empty}>
							<Typography variant='secondary' style={styles.emptyText}>
								{filters.status
									? 'No orders match the selected status.'
									: 'There are currently no orders. While you wait, you can customize your store.'}
							</Typography>
						</View>
					)
				}
				refreshControl={refreshControl}
			/>
		</View>
	);
};

interface OrdersListItemProps {
	order: Order;
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row onPress={onPress} style={styles.container}>
			<View>
				<Typography>{order.user.name}</Typography>
				<Spacer y={2} />
				<Typography size='small' variant='secondary' style={styles.date}>
					{ORDER_STATUS_LABELS[order.status]} · {relativeDate(order.createdAt)}
				</Typography>
			</View>
			<View style={styles.right}>
				<Typography>{formatNaira(order.total)}</Typography>
				<Icon name='chevron-right' size={20} color='#999' />
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	empty: {
		paddingTop: 32,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 16
	},
	emptyText: {
		textAlign: 'center'
	},
	container: {
		paddingVertical: 8,
		paddingLeft: 16,
		paddingRight: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	date: {
		marginTop: 2
	},
	right: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	}
});

export default OrdersList;
