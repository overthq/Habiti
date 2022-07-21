import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserOrdersQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import OrdersListItem from '../components/orders/OrdersListItem';

// This screen is an in-depth list of orders.
// It should support filtering and bulk actions (maybe).

const Orders: React.FC = () => {
	const [{ data, fetching }] = useUserOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Order', { orderId });
		},
		[]
	);

	if (fetching) return <View />;

	return (
		<View style={styles.container}>
			<FlatList
				data={data?.currentUser.orders}
				renderItem={({ item }) => (
					<OrdersListItem order={item} onPress={handleOrderPress(item.id)} />
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Orders;
