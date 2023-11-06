import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import OrdersFilter from '../components/orders/OrdersFilter';
import OrdersListItem from '../components/orders/OrdersListItem';
import { OrdersQuery, useOrdersQuery } from '../types/api';
import { OrdersStackParamList } from '../types/navigation';
import Screen from '../components/global/Screen';

// Ultimately, we should consider making this a SectionList
// or advanced FlatList, that can separate records based on dates.
// We also should have a fiiltering system based on order statuses.
// A searchbar is also important.

const Orders: React.FC = () => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();
	const [{ data }] = useOrdersQuery();

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
							<Text style={styles.emptyText}>
								There are currently no orders. While you wait, you can customize
								your store.
							</Text>
						</View>
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
		textAlign: 'center',
		color: '#505050',
		fontSize: 16
	}
});

export default Orders;
