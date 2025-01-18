import { Typography, useTheme } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { View, RefreshControl, StyleSheet } from 'react-native';

import OrdersListItem from '../../components/orders/OrdersListItem';
import { OrdersQuery, useOrdersQuery } from '../../types/api';
import { MainTabParamList, OrdersStackParamList } from '../../types/navigation';
import useRefresh from '../../hooks/useRefresh';

const OrdersList = () => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Orders'>>();
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const [{ fetching, data }, refetch] = useOrdersQuery({ variables: params });
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	const renderOrder: ListRenderItem<
		OrdersQuery['currentStore']['orders'][number]
	> = React.useCallback(({ item }) => {
		return <OrdersListItem onPress={handleOrderPress(item.id)} order={item} />;
	}, []);

	return (
		<FlashList
			keyExtractor={i => i.id}
			data={data?.currentStore.orders}
			renderItem={renderOrder}
			estimatedItemSize={60}
			ListEmptyComponent={
				<View style={styles.empty}>
					<Typography variant='secondary' style={styles.emptyText}>
						There are currently no orders. While you wait, you can customize
						your store.
					</Typography>
				</View>
			}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		/>
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
	}
});

export default OrdersList;
