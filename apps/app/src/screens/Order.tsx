import {
	Button,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
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
import {
	OrderStatus,
	useOrderQuery,
	useUpdateOrderMutation
} from '../types/api';
import { AppStackParamList, HomeStackParamList } from '../types/navigation';
import useRefresh from '../hooks/useRefresh';

// What actions should users be able to carry out on their orders on this screen?

interface PaymentPendingWarningProps {
	orderId: string;
}

const PaymentPendingWarning = ({ orderId }: PaymentPendingWarningProps) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [, updateOrder] = useUpdateOrderMutation();

	const handleMakePayment = () => {
		navigate('Add Card', { orderId });
	};

	const handleCancelOrder = () => {
		updateOrder({
			orderId,
			input: { status: OrderStatus.Cancelled }
		});
	};

	return (
		<View
			style={{
				marginBottom: 12,
				marginHorizontal: 16,
				backgroundColor: theme.input.background,
				padding: 12,
				borderRadius: 8
			}}
		>
			<Typography weight='medium'>Payment pending</Typography>
			<Spacer y={4} />
			<Typography variant='secondary' size='small'>
				This order has a pending payment. Please make the payment to complete
				your order.
			</Typography>
			<Spacer y={12} />
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<Button
					style={{ flex: 1 }}
					text='Make Payment'
					variant='primary'
					size='small'
					onPress={handleMakePayment}
				/>
				<Button
					style={{ flex: 1 }}
					text='Cancel Order'
					variant='destructive'
					size='small'
					onPress={handleCancelOrder}
				/>
			</View>
		</View>
	);
};

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
