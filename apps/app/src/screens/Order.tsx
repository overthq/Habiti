import { Button, Screen, Spacer } from '@habiti/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import OrderStatusPill from '../components/home/OrderStatusPill';
import OrderMeta from '../components/order/OrderMeta';
import OrderProduct from '../components/order/OrderProduct';
import StoreMeta from '../components/order/StoreMeta';
import useGoBack from '../hooks/useGoBack';
import { useOrderQuery } from '../types/api';
import { AppStackParamList, HomeStackParamList } from '../types/navigation';

// What actions should users be able to carry out on their orders on this screen?

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<HomeStackParamList, 'Home.Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	useGoBack();
	const order = data?.order;

	const handleOrderProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (fetching || !order) {
		return <View style={styles.container} />;
	}

	return (
		<Screen style={styles.container}>
			<StoreMeta store={order.store} />
			<Spacer y={16} />
			<OrderStatusPill status={order.status} />
			<View style={styles.products}>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.productId}
						orderProduct={orderProduct}
						onPress={handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
			<OrderMeta order={order} />
			<View style={{ paddingHorizontal: 16 }}>
				<Button text='Cancel Order' variant='destructive' onPress={() => {}} />
			</View>
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	products: {
		paddingVertical: 8,
		borderRadius: 4,
		overflow: 'hidden'
	}
});

export default Order;
