import React from 'react';
import {
	Avatar,
	Button,
	CustomImage,
	Row,
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
import { View, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { formatNaira } from '@habiti/common';

import { useOrderQuery } from '../data/queries';
import { useUpdateOrderMutation } from '../data/mutations';
import {
	Order as OrderType,
	OrderProduct as OrderProductType,
	OrderStatus,
	Store
} from '../data/types';
import { AppStackParamList, HomeStackParamList } from '../navigation/types';
import useRefresh from '../hooks/useRefresh';
import { relativeTimestamp } from '../utils/date';
import { plural } from '../utils/strings';

// What actions should users be able to carry out on their orders on this screen?

interface StoreMetaProps {
	store: Store;
}

const StoreMeta: React.FC<StoreMetaProps> = ({ store }) => {
	const { navigate } = useNavigation<NavigationProp<HomeStackParamList>>();

	return (
		<Pressable
			style={{ paddingVertical: 12 }}
			onPress={() => {
				navigate('Home.Store', { storeId: store.id });
			}}
		>
			<View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
				<Avatar
					size={40}
					uri={store.image?.path}
					circle
					fallbackText={store.name}
				/>
				<View>
					<Typography weight='medium' size='large'>
						{store.name}
					</Typography>
					<Typography size='small' variant='secondary'>
						Visit store
					</Typography>
				</View>
			</View>
		</Pressable>
	);
};

interface OrderProductProps {
	orderProduct: OrderProductType;
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => {
	return (
		<Row style={styles.productContainer} onPress={onPress}>
			<View style={styles.productLeft}>
				<CustomImage
					height={40}
					width={40}
					uri={product.images[0]?.path}
					style={styles.productImage}
				/>
				<View>
					<Typography>{product.name}</Typography>
					<Typography
						variant='secondary'
						size='small'
						style={styles.productPrice}
					>
						{plural('unit', quantity)}
					</Typography>
				</View>
			</View>
			<Typography>{formatNaira(quantity * unitPrice)}</Typography>
		</Row>
	);
};

interface OrderMetaProps {
	order: OrderType;
}

const OrderMeta: React.FC<OrderMetaProps> = ({ order }) => {
	return (
		<View style={styles.metaContainer}>
			<View style={styles.metaRow}>
				<Typography>Date</Typography>
				<Typography variant='secondary'>
					{relativeTimestamp(order.createdAt)}
				</Typography>
			</View>
			<View style={styles.metaRow}>
				<Typography>Total</Typography>
				<Typography variant='secondary'>{formatNaira(order.total)}</Typography>
			</View>
		</View>
	);
};

interface PaymentPendingWarningProps {
	orderId: string;
}

const PaymentPendingWarning: React.FC<PaymentPendingWarningProps> = ({
	orderId
}) => {
	const { theme } = useTheme();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const updateOrderMutation = useUpdateOrderMutation();

	const handleMakePayment = () => {
		navigate('Modal.AddCard', { orderId });
	};

	const handleCancelOrder = () => {
		updateOrderMutation.mutate({
			orderId,
			body: { status: OrderStatus.Cancelled }
		});
	};

	return (
		<View
			style={[
				styles.warningContainer,
				{ backgroundColor: theme.input.background }
			]}
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

const Order = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<HomeStackParamList, 'Home.Order'>>();
	const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
	const { data, isLoading, refetch } = useOrderQuery(orderId);
	const order = data?.order;
	const { theme } = useTheme();
	const { refreshing, refresh } = useRefresh({ refetch });

	const handleOrderProductPress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { productId });
		},
		[]
	);

	if (isLoading && !order) {
		return <View style={styles.screenContainer} />;
	}

	return (
		<ScrollableScreen
			style={styles.screenContainer}
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
			<View style={{ marginHorizontal: -16 }}>
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
	screenContainer: {
		paddingTop: 12
	},
	productContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 6
	},
	productLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	productImage: {
		marginRight: 8
	},
	productPrice: {
		marginTop: 2
	},
	metaContainer: {
		paddingTop: 8,
		marginVertical: 16
	},
	metaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	warningContainer: {
		marginBottom: 12,
		padding: 12,
		borderRadius: 8
	}
});

export default Order;
