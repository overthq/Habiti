import { Screen } from '@market/components';
import {
	NavigationProp,
	RouteProp,
	useNavigation,
	useRoute
} from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import OrderMeta from '../components/order/OrderMeta';
import OrderProduct from '../components/order/OrderProduct';
import useGoBack from '../hooks/useGoBack';
import { useOrderQuery } from '../types/api';
import { AppStackParamList } from '../types/navigation';

// What actions should users be able to carry out on their orders on this screen?

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
		<Screen style={styles.container}>
			<View style={{ marginLeft: 16, marginBottom: 16 }}>
				<Text>{order.status}</Text>
			</View>
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
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16
	},
	products: {
		marginHorizontal: 16,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 4,
		overflow: 'hidden'
	}
});

export default Order;
