import { ScrollableScreen, Spacer, useTheme } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';

import OrderMeta from '../components/order/OrderMeta';
import OrderProduct from '../components/order/OrderProduct';
import StoreMeta from '../components/order/StoreMeta';
import useGoBack from '../hooks/useGoBack';
import { OrderStatus, useOrderQuery } from '../types/api';
import { AppStackParamList, HomeStackParamList } from '../types/navigation';
import useRefresh from '../hooks/useRefresh';
import PaymentPendingWarning from '../components/order/PaymentPendingWarning';

// What actions should users be able to carry out on their orders on this screen?

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<HomeStackParamList, 'Home.Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }, refetch] = useOrderQuery({
		variables: { orderId }
	});
	useGoBack();
	const order = data?.order;
	const { theme } = useTheme();
	const { refreshing, refresh } = useRefresh({ fetching, refetch });

	const handleOrderProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching && !order) {
		return <View style={styles.container} />;
	}

	return (
		<ScrollableScreen
			style={styles.container}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={refresh}
					tintColor={theme.text.secondary}
				/>
			}
		>
			<StoreMeta store={order.store} />
			<Spacer y={12} />
			<View>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.productId}
						orderProduct={orderProduct}
						onPress={handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
			<OrderMeta order={order} />
			{order.status === OrderStatus.PaymentPending && (
				<PaymentPendingWarning orderId={orderId} />
			)}
		</ScrollableScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 12
	}
});

export default Order;
