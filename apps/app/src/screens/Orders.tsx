import React from 'react';
import { RefreshControl, View } from 'react-native';
import { Screen, useTheme } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';

import OrdersListItem from '../components/orders/OrdersListItem';
import { useUserOrdersQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import useRefresh from '../hooks/useRefresh';

const Orders: React.FC = () => {
	const [{ data, fetching }, refetch] = useUserOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();

	useGoBack();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (fetching && !data) return <View />;

	return (
		<Screen style={{ paddingHorizontal: 16, paddingTop: 16 }}>
			<FlashList
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refresh}
						tintColor={theme.text.secondary}
					/>
				}
				keyExtractor={item => item.id}
				contentContainerStyle={{ backgroundColor: theme.screen.background }}
				data={data?.currentUser.orders}
				renderItem={({ item }) => (
					<OrdersListItem order={item} onPress={handleOrderPress(item.id)} />
				)}
			/>
		</Screen>
	);
};

export default Orders;
