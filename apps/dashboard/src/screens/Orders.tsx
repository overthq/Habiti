import React from 'react';
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	StyleSheet,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatNaira } from '@habiti/common';
import {
	Icon,
	IconButton,
	PillButton,
	Row,
	Screen,
	ScreenHeader,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import { useOrdersQuery } from '../data/queries';
import { Order, OrderFilters, OrderStatus } from '../data/types';
import { OrdersFilters, useOrdersFilterStore } from '../state/filters';
import { useSheet } from '../navigation/useSheet';
import useRefresh from '../hooks/useRefresh';
import { relativeDate } from '../utils/date';
import { ORDER_STATUS_LABELS } from '../utils/orderStatus';
import type { OrdersStackParamList } from '../navigation/types';

const Orders: React.FC = () => {
	const { top } = useSafeAreaInsets();

	return (
		<OrdersProvider>
			<Screen style={{ paddingTop: top }}>
				<OrdersScreenHeader />
				<OrdersList />
			</Screen>
		</OrdersProvider>
	);
};

interface OrdersContextType {
	orders: Order[];
	isLoading: boolean;
	refreshing: boolean;
	refresh: () => void;
	openFilterModal: () => void;
}

const OrdersContext = React.createContext<OrdersContextType | null>(null);

const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const { openSheet } = useSheet();
	const filters = useOrdersFilterStore(state => state.filters);

	const queryFilters = buildFiltersFromState(filters);
	const { data, isLoading, refetch } = useOrdersQuery(queryFilters);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	const openFilterModal = React.useCallback(() => {
		openSheet('ordersFilter');
	}, [openSheet]);

	const value = React.useMemo<OrdersContextType>(
		() => ({
			orders: data?.orders ?? [],
			isLoading,
			refreshing: isRefreshing,
			refresh: onRefresh,
			openFilterModal
		}),
		[data, isLoading, isRefreshing, onRefresh, openFilterModal]
	);

	return (
		<OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
	);
};

const useOrdersContext = () => {
	const context = React.use(OrdersContext);

	if (!context) {
		throw new Error('useOrdersContext must be used within an OrdersProvider');
	}

	return context;
};

const buildFiltersFromState = (filters: OrdersFilters): OrderFilters => {
	const result: OrderFilters = {};

	if (filters.status) {
		result.status = filters.status;
	}

	if (filters.sortBy) {
		result.orderBy = sortByMap[filters.sortBy];
	}

	return result;
};

const sortByMap: Record<
	NonNullable<OrdersFilters['sortBy']>,
	OrderFilters['orderBy']
> = {
	'created-at-desc': { createdAt: 'desc' },
	'total-desc': { total: 'desc' },
	'total-asc': { total: 'asc' }
};

const ORDER_STATUSES = [
	{
		label: 'Pending',
		value: OrderStatus.Pending
	},
	{
		label: 'Ready for pickup',
		value: OrderStatus.ReadyForPickup
	},
	{
		label: 'Completed',
		value: OrderStatus.Completed
	},
	{
		label: 'Cancelled',
		value: OrderStatus.Cancelled
	}
];

const OrdersScreenHeader = () => {
	const { openFilterModal } = useOrdersContext();

	return (
		<ScreenHeader
			title='Orders'
			right={
				<IconButton
					name='sliders-horizontal'
					size={20}
					onPress={openFilterModal}
					style={{ marginVertical: -10, marginRight: -12 }}
				/>
			}
			hasBottomBorder
		>
			<OrderStatusPills />
		</ScreenHeader>
	);
};

const OrderStatusPills = () => {
	const { filters, setFilters } = useOrdersFilterStore();

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ marginTop: 8, marginHorizontal: -16 }}
			contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
		>
			<OrderStatusPill
				label='All'
				active={filters.status === undefined}
				onPress={() => {
					setFilters({ status: undefined });
				}}
			/>
			{ORDER_STATUSES.map(status => (
				<OrderStatusPill
					key={status.label}
					active={status.value === filters.status}
					onPress={() => {
						setFilters({ status: status.value });
					}}
					label={status.label}
				/>
			))}
		</ScrollView>
	);
};

interface OrderStatusPillProps {
	active: boolean;
	label: string;
	onPress(): void;
}

const OrderStatusPill: React.FC<OrderStatusPillProps> = ({
	label,
	active,
	onPress
}) => {
	return (
		<PillButton
			style={headerStyles.pill}
			variant={active ? 'primary' : 'secondary'}
			onPress={onPress}
			text={label}
		/>
	);
};

const headerStyles = StyleSheet.create({
	pill: {
		paddingHorizontal: 12,
		paddingVertical: 4
	}
});

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
						<View style={listStyles.empty}>
							<ActivityIndicator color={theme.text.secondary} />
						</View>
					) : (
						<View style={listStyles.empty}>
							<Typography variant='secondary' style={listStyles.emptyText}>
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
		<Row onPress={onPress} style={listStyles.container}>
			<View>
				<Typography weight='medium'>{order.user.name}</Typography>
				<Spacer y={2} />
				<Typography size='small' variant='secondary' style={listStyles.date}>
					{ORDER_STATUS_LABELS[order.status]} · {relativeDate(order.createdAt)}
				</Typography>
			</View>
			<View style={listStyles.right}>
				<Typography>{formatNaira(order.total)}</Typography>
				<Icon name='chevron-right' size={20} color='#999' />
			</View>
		</Row>
	);
};

const listStyles = StyleSheet.create({
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

export default Orders;
