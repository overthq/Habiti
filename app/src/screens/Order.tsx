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
import { formatNaira } from '../utils/currency';
import useGoBack from '../hooks/useGoBack';
import OrderMeta from '../components/order/OrderMeta';

const Order: React.FC = () => {
	const {
		params: { orderId, storeId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	useGoBack();
	const order = data?.order;

	const handleOrderProductPress = React.useCallback(
		(productId: string) => {
			navigate('Product', { productId, storeId });
		},
		[storeId]
	);

	if (fetching || !order) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<OrderMeta order={order} />
			<View style={styles.products}>
				{order.products.map(orderProduct => (
					<OrderProduct
						key={orderProduct.productId}
						orderProduct={orderProduct}
						onPress={() => handleOrderProductPress(orderProduct.productId)}
					/>
				))}
			</View>
			<View style={styles.figures}>
				<View style={styles.figureRow}>
					<Text style={styles.figureKey}>Total</Text>
					<Text style={styles.figureKey}>{formatNaira(order.total)}</Text>
				</View>
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
	},
	figures: {
		paddingHorizontal: 16
	},
	figureRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	figureKey: {
		fontSize: 16,
		fontWeight: '500'
	}
});

export default Order;
