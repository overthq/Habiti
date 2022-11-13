import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';
import OrderProduct from '../components/order/OrderProduct';
import useGoBack from '../hooks/useGoBack';
import OrderMeta from '../components/order/OrderMeta';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();
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
		<View style={styles.container}>
			<OrderMeta order={order} />
			<View style={styles.products}>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.id}
						orderProduct={orderProduct}
						onPress={handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	products: {
		marginVertical: 16
	}
});

export default Order;
