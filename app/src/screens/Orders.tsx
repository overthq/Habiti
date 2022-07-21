import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useUserOrdersQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// This screen is an in-depth list of orders.
// It should support filtering and bulk actions (maybe).

const Orders: React.FC = () => {
	const [{ data, fetching }] = useUserOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<AppStackParamList>>();

	const handleOrderPress = React.useCallback((orderId: string) => {
		navigate('Order', { orderId });
	}, []);

	return (
		<View style={styles.container}>
			<FlatList data={data?.currentUser.orders} renderItem={() => <View />} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Orders;
