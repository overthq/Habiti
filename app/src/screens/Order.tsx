import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	useGoBack();
	const order = data?.order;

	const handleOrderProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	React.useLayoutEffect(() => {
		if (!fetching) {
			setOptions({ headerTitle: `${data?.order.store.name} Order` });
		}
	}, [fetching, data?.order.store.name]);

	if (fetching || !order) {
		return <View style={styles.container} />;
	}

	return (
		<View style={styles.container}>
			<Text>{order.status}</Text>
			<View style={styles.products}>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.id}
						orderProduct={orderProduct}
						onPress={handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
			<OrderMeta order={order} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 16
	},
	products: {
		backgroundColor: '#FFFFFF',
		marginHorizontal: 16,
		paddingHorizontal: 16,
		paddingTop: 8,
		// paddingBottom: 8,
		borderRadius: 4,
		overflow: 'hidden'
	}
});

export default Order;
