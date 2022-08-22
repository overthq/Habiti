import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	ActivityIndicator
} from 'react-native';
import {
	useRoute,
	useNavigation,
	RouteProp,
	NavigationProp
} from '@react-navigation/native';
import { useOrderQuery } from '../types/api';
import {
	ProductsStackParamList,
	OrdersStackParamsList
} from '../types/navigation';
import OrderProduct from '../components/order/OrderProduct';
import useGoBack from '../hooks/useGoBack';
import { formatNaira } from '../utils/currency';
import { parseTimestamp } from '../utils/date';

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { id: orderId } });
	useGoBack();

	const handleOrderProductPress = React.useCallback((productId: string) => {
		navigate('Product', { productId });
	}, []);

	if (fetching) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}

	if (!data?.order) {
		// TODO: Create app-wide screen-level error boundary.
		return (
			<View>
				<Text>An error has occured.</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.name}>{data?.order?.user.name}</Text>
			<Text>{data?.order?.status}</Text>
			<Text>Date: {parseTimestamp(data?.order.createdAt)}</Text>
			<View>
				<Text style={styles.sectionHeader}>Products</Text>
				{/* TODO: This should become a horizontal slider of the products included in the order. */}
				{data?.order?.products.map(product => (
					<OrderProduct
						key={product.productId}
						orderProduct={product}
						onPress={() => handleOrderProductPress(product.productId)}
					/>
				))}
			</View>

			<View style={{ marginTop: 8 }}>
				<Text style={{ fontSize: 16 }}>
					Total: {formatNaira(data?.order?.total ?? 0)}
				</Text>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		backgroundColor: '#FFFFFF'
	},
	name: {
		fontSize: 16,
		marginVertical: 16
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500',
		marginVertical: 4
	}
});

export default Order;
