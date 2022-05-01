import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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

const Order: React.FC = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamsList, 'Order'>>();
	const { navigate } = useNavigation<NavigationProp<ProductsStackParamList>>();
	const [{ data }] = useOrderQuery({ variables: { id: orderId } });
	useGoBack();
	const order = data?.order;

	const handleOrderProductPress = React.useCallback((productId: string) => {
		navigate('Product', { productId });
	}, []);

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.name}>{order?.user.name}</Text>
			{/* <Text>{order.status}</Text> */}
			<View>
				<Text style={styles.sectionHeader}>Products</Text>
				{order?.products.map(product => (
					<OrderProduct
						key={product.productId}
						orderProduct={product}
						onPress={() => handleOrderProductPress(product.productId)}
					/>
				))}
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
		marginVertical: 8
	}
});

export default Order;
