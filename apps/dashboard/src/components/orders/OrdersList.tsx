import React from 'react';
import { View, RefreshControl, StyleSheet } from 'react-native';
import { Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import OrdersListItem from '../../components/orders/OrdersListItem';
import { OrdersStackParamList } from '../../types/navigation';
import { useOrdersContext } from './OrdersContext';
import { Order } from '../../data/types';

const OrdersList = () => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const { orders, refreshing, refresh } = useOrdersContext();
	const { theme } = useTheme();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	const renderOrder: ListRenderItem<Order> = React.useCallback(({ item }) => {
		return <OrdersListItem onPress={handleOrderPress(item.id)} order={item} />;
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<FlashList
				keyExtractor={i => i.id}
				data={orders}
				renderItem={renderOrder}
				estimatedItemSize={60}
				contentContainerStyle={{ backgroundColor: theme.screen.background }}
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
		</View>
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
