import { Screen, Typography, useTheme } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import React from 'react';
import {
	View,
	FlatList,
	StyleSheet,
	ListRenderItem,
	RefreshControl
} from 'react-native';

import OrdersFilter from '../components/orders/OrdersFilter';
import OrdersListItem from '../components/orders/OrdersListItem';
import { OrdersQuery, useOrdersQuery } from '../types/api';
import { MainTabParamList, OrdersStackParamList } from '../types/navigation';

// Ultimately, we should consider making this a SectionList
// or advanced FlatList, that can separate records based on dates.
// We also should have a fiiltering system based on order statuses.
// A searchbar is also important.

const Orders: React.FC = () => {
	const { params } = useRoute<RouteProp<MainTabParamList, 'Orders'>>();
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const [{ fetching, data }, refetch] = useOrdersQuery({ variables: params });
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
		<Screen>
			<OrdersFilter />
			<View style={{ flex: 1 }}>
				<FlatList
					keyExtractor={i => i.id}
					data={data?.currentStore.orders}
					renderItem={renderOrder}
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
							refreshing={fetching}
							onRefresh={() => {
								refetch({ requestPolicy: 'network-only' });
							}}
							tintColor={theme.text.secondary}
						/>
					}
				/>
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	empty: {
		paddingTop: 32,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	emptyText: {
		paddingHorizontal: 16,
		textAlign: 'center'
	}
});

export default Orders;
