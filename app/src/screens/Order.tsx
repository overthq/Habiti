import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import OrderProduct from '../components/order/OrderProduct';
import { relativeTimestamp } from '../utils/date';

const Order: React.FC = () => {
	const {
		params: { orderId, storeId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	const order = data?.order;

	const handleOrderProductPress = React.useCallback((productId: string) => {
		navigate('Product', { productId, storeId });
	}, []);

	if (fetching || !order) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={{ paddingTop: 16, paddingHorizontal: 16 }}>
				<Text>Order Details:</Text>
				<Text>{relativeTimestamp(order.createdAt)}</Text>
			</View>
			<View style={{ marginVertical: 16 }}>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.productId}
						orderProduct={orderProduct}
						onPress={() => handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
			<View>
				<Text>Total: {order.total}.00 NGN</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default Order;
