import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrdersListItem from '../components/orders/OrdersListItem';
import { useOrdersQuery } from '../types/api';

const Orders: React.FC = () => {
	const [{ data }] = useOrdersQuery();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Orders</Text>
			</View>
			<FlatList
				keyExtractor={i => i.id}
				renderItem={({ item }) => <OrdersListItem order={item} />}
				data={data?.orders}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
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
	container: {
		flex: 1
	}
});

export default Orders;
