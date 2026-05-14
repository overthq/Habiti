import React from 'react';
import { RefreshControl, View, StyleSheet } from 'react-native';
import {
	Avatar,
	Row,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';

import { useOrdersQuery } from '../data/queries';
import useRefresh from '../hooks/useRefresh';
import { plural } from '../utils/strings';
import { relativeTimestamp } from '../utils/date';

import type { Order } from '../data/types';
import type { HomeStackParamList } from '../navigation/types';

const Orders = () => {
	const { data, isLoading, refetch } = useOrdersQuery();
	const { navigate } = useNavigation<StackNavigationProp<HomeStackParamList>>();
	const { refreshing, refresh } = useRefresh({ refetch });
	const { theme } = useTheme();
	const { bottom } = useSafeAreaInsets();

	const handleOrderPress = React.useCallback(
		(orderId: string) => () => {
			navigate('Home.Order', { orderId });
		},
		[]
	);

	if (isLoading && !data) return <View />;

	return (
		<Screen style={{ padding: 0 }}>
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
				data={data?.orders}
				renderItem={({ item }) => (
					<OrdersListItem order={item} onPress={handleOrderPress(item.id)} />
				)}
				ListFooterComponent={() => <Spacer y={bottom} />}
			/>
		</Screen>
	);
};

interface OrdersListItemProps {
	order: Order;
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row key={order.id} style={styles.container} onPress={onPress}>
			<Avatar
				uri={order.store.image?.path}
				size={48}
				circle
				fallbackText={order.store.name}
			/>
			<View style={styles.info}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Typography weight='medium' size='large'>
						{order.store.name}
					</Typography>
					<Typography size='small' variant='secondary'>
						{` · ${relativeTimestamp(order.createdAt)}`}
					</Typography>
				</View>
				<Spacer y={4} />
				<Typography size='small' variant='secondary'>
					{formatNaira(order.total)} ·{' '}
					{plural('product', order.products.length)}
				</Typography>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	info: {
		marginLeft: 8
	}
});

export default Orders;
