import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrdersListItem from '../components/orders/OrdersListItem';
import { useOrdersQuery } from '../types/api';

const Orders: React.FC = () => {
	const [{ data }] = useOrdersQuery();

	return (
		<View style={styles.container}>
			<FlatList
				keyExtractor={i => i.id}
				renderItem={({ item }) => <OrdersListItem order={item} />}
				data={data?.store.orders}
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
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	header: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		fontWeight: 'bold',
		fontSize: 32
	},
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
