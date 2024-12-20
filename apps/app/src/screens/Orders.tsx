import { Screen } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';

import OrdersListItem from '../components/orders/OrdersListItem';
import { useUserOrdersQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';

const Orders: React.FC = () => {
	const [{ data, fetching }] = useUserOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<HomeStackParamList>>();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (fetching) return <View />;

	return (
		<Screen>
			<FlashList
				data={data?.currentUser.orders}
				renderItem={({ item }) => (
					<OrdersListItem order={item} onPress={handleOrderPress(item.id)} />
				)}
			/>
		</Screen>
	);
};

export default Orders;
