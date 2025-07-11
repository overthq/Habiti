import React from 'react';
import { RefreshControl, View } from 'react-native';
import { Screen, Spacer, useTheme } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';

import OrdersListItem from '../components/orders/OrdersListItem';
import { useUserOrdersQuery } from '../types/api';
import { HomeStackParamList } from '../types/navigation';
import useGoBack from '../hooks/useGoBack';
import useRefresh from '../hooks/useRefresh';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Orders: React.FC = () => {
	const [{ data, fetching }, refetch] = useUserOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	useGoBack();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (fetching && !data) return <View />;

	return (
		<Screen>
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
				ListFooterComponent={() => <Spacer y={bottom} />}
			/>
		</Screen>
	);
};

export default Orders;
