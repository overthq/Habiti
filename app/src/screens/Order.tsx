import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	ActivityIndicator,
	Pressable
} from 'react-native';
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
import { formatNaira } from '../utils/currency';

const Order: React.FC = () => {
	const {
		params: { orderId, storeId }
	} = useRoute<RouteProp<AppStackParamList, 'Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const [{ data, fetching }] = useOrderQuery({ variables: { orderId } });
	const order = data?.order;

	const handleStorePress = React.useCallback(() => {
		navigate('Store', { storeId });
	}, [storeId]);

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
			<View style={styles.meta}>
				<Pressable style={styles.store} onPress={handleStorePress}>
					<View style={styles.placeholder}>
						{order.store.image ? (
							<Image
								style={styles.image}
								source={{ uri: order.store.image.path }}
							/>
						) : (
							<Text style={styles.avatarText}>{order.store.name[0]}</Text>
						)}
					</View>
					<Text style={styles.storeName}>{order.store.name}</Text>
				</Pressable>
				<Text>{relativeTimestamp(order.createdAt)}</Text>
			</View>
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
	meta: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	store: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	storeName: {
		fontSize: 18,
		fontWeight: '500'
	},
	placeholder: {
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: '#D3D3D3',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	},
	image: {
		width: '100%',
		height: '100%'
	},
	avatarText: {
		fontSize: 24,
		fontWeight: '500',
		color: '#505050'
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
