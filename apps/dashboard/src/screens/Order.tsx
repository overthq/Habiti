import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	Badge,
	Button,
	CustomImage,
	Icon,
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
import { format } from 'date-fns';

import useRefresh from '../hooks/useRefresh';
import Refresher from '../components/Refresher';
import { useOrderQuery } from '../data/queries';
import { useUpdateOrderMutation } from '../data/mutations';
import {
	ORDER_STATUS_LABELS,
	ORDER_STATUS_COLOR_VARIANTS
} from '../utils/orderStatus';
import { OrdersStackParamList } from '../navigation/types';
import {
	Order as OrderType,
	OrderProduct as OrderProductType,
	OrderStatus,
	User
} from '../data/types';

const Order = () => {
	const {
		params: { orderId }
	} = useRoute<RouteProp<OrdersStackParamList, 'Order'>>();
	const { data, refetch } = useOrderQuery(orderId);
	const { isRefreshing, onRefresh } = useRefresh({ refetch });

	if (!data?.order) {
		return <View />;
	}

	return (
		<ScrollableScreen
			refreshControl={
				<Refresher refreshing={isRefreshing} onRefresh={onRefresh} />
			}
		>
			<Spacer y={16} />
			<OrderOverview order={data.order} />
			<AwaitingPickupBanner status={data.order.status} />
			<CustomerDetails user={data.order.user} />
			<OrderProducts products={data.order.products} />
			<PaymentInfo order={data.order} />
			<OrderActions orderId={data.order.id} status={data.order.status} />
		</ScrollableScreen>
	);
};

interface OrderOverviewProps {
	order: OrderType;
}

const OrderOverview: React.FC<OrderOverviewProps> = ({ order }) => {
	const statusLabel = ORDER_STATUS_LABELS[order.status];
	const statusVariant = ORDER_STATUS_COLOR_VARIANTS[order.status];
	const formattedDate = format(
		new Date(order.createdAt),
		"MMMM do, yyyy 'at' h:mma"
	);

	return (
		<View style={overviewStyles.container}>
			<Badge text={statusLabel} variant={statusVariant} />
			<Typography size='small' weight='medium' variant='secondary'>
				{formattedDate}
			</Typography>
		</View>
	);
};

const overviewStyles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		gap: 8,
		paddingBottom: 16
	}
});

interface AwaitingPickupBannerProps {
	status: OrderStatus;
}

const AwaitingPickupBanner: React.FC<AwaitingPickupBannerProps> = ({
	status
}) => {
	const { theme } = useTheme();

	if (status !== OrderStatus.ReadyForPickup) {
		return null;
	}

	return (
		<View
			style={[
				bannerStyles.container,
				{ backgroundColor: theme.badge.warning.backgroundColor }
			]}
		>
			<Typography
				weight='semibold'
				size='small'
				style={{ color: theme.badge.warning.color }}
			>
				Awaiting Customer Pickup
			</Typography>
			<Spacer y={4} />
			<Typography
				size='small'
				style={[bannerStyles.description, { color: theme.badge.warning.color }]}
			>
				This order is ready and waiting for the customer to collect it. No
				further action is needed from you.
			</Typography>
		</View>
	);
};

const bannerStyles = StyleSheet.create({
	container: {
		marginBottom: 16,
		padding: 12,
		borderRadius: 8
	},
	description: {
		lineHeight: 20,
		opacity: 0.8
	}
});

interface CustomerDetailProps {
	user: User;
}

const CustomerDetails: React.FC<CustomerDetailProps> = ({ user }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();

	const handlePress = React.useCallback(() => {
		navigate('CustomerInfo', { userId: user.id });
	}, [navigate, user.id]);

	return (
		<View>
			<Typography weight='medium'>Customer</Typography>
			<Spacer y={8} />
			<Typography>{user.name}</Typography>
			<Spacer y={12} />
			<Button text='View order history' onPress={handlePress} />
		</View>
	);
};

interface OrderProductsProps {
	products: OrderProductType[];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ products }) => {
	const { navigate } = useNavigation<NavigationProp<OrdersStackParamList>>();

	const handlePress = React.useCallback(
		(productId: string) => () => {
			navigate('Product', { screen: 'Product.Main', params: { productId } });
		},
		[navigate]
	);

	return (
		<View style={productsStyles.container}>
			<Typography weight='medium' style={productsStyles.sectionHeader}>
				Products
			</Typography>

			<View style={productsStyles.list}>
				{products.map(p => (
					<OrderProduct
						key={p.productId}
						onPress={handlePress(p.productId)}
						orderProduct={p}
					/>
				))}
			</View>
		</View>
	);
};

const productsStyles = StyleSheet.create({
	container: {
		marginVertical: 16
	},
	sectionHeader: {
		marginBottom: 4
	},
	list: {
		marginHorizontal: -16
	}
});

interface OrderProductProps {
	orderProduct: OrderProductType;
	onPress(): void;
}

const OrderProduct: React.FC<OrderProductProps> = ({
	orderProduct: { product, quantity, unitPrice },
	onPress
}) => {
	const { theme } = useTheme();

	return (
		<Row onPress={onPress} style={productStyles.container}>
			<View style={productStyles.left}>
				<CustomImage
					uri={product.images[0]?.path}
					height={44}
					width={44}
					style={productStyles.image}
				/>
				<View>
					<Typography>{product.name}</Typography>
					<Spacer y={2} />
					<Typography size='regular' variant='secondary'>
						{formatNaira(unitPrice * quantity)}
					</Typography>
				</View>
			</View>
			<Icon name='chevron-right' color={theme.text.secondary} size={20} />
		</Row>
	);
};

const productStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 10
	},
	left: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	image: {
		marginRight: 10
	}
});

interface PaymentInfoProps {
	order: OrderType;
}

// This should show the payment details for the order.
// - Discounts or coupons, if any
// - Fee breakdown (payment provider and ours).
// - Tax (VAT and otherwise)

const PaymentInfo: React.FC<PaymentInfoProps> = ({ order }) => {
	return (
		<View style={paymentStyles.container}>
			<Typography weight='medium' style={paymentStyles.sectionHeader}>
				Payment
			</Typography>
			<View style={paymentStyles.row}>
				<Typography>Subtotal</Typography>
				<Typography>{formatNaira(order.total)}</Typography>
			</View>
			<View style={paymentStyles.row}>
				<Typography>Fees</Typography>
				<Typography>
					{formatNaira(order.serviceFee + order.transactionFee)}
				</Typography>
			</View>
			<View style={paymentStyles.row}>
				<Typography>Total</Typography>
				<Typography>
					{formatNaira(order.total + order.serviceFee + order.transactionFee)}
				</Typography>
			</View>
		</View>
	);
};

const paymentStyles = StyleSheet.create({
	container: {
		paddingVertical: 8
	},
	sectionHeader: {
		marginBottom: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4
	},
	button: {
		marginTop: 4
	}
});

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, status }) => {
	const updateOrderMutation = useUpdateOrderMutation();

	const onConfirmReadyForPickup = () => {
		Alert.alert(
			'Ready for pickup',
			'Mark this order as ready for customer pickup?',
			[
				{
					text: 'Confirm',
					onPress: updateOrderStatus(OrderStatus.ReadyForPickup)
				},
				{ text: 'Cancel', style: 'cancel' }
			]
		);
	};

	const confirmCancel = () => {
		Alert.alert('Cancel order', 'Are you sure you want to cancel this order', [
			{
				text: 'Proceed',
				style: 'destructive',
				onPress: updateOrderStatus(OrderStatus.Cancelled)
			},
			{ text: 'Cancel', style: 'cancel' }
		]);
	};

	const updateOrderStatus = React.useCallback(
		(status: OrderStatus) => () => {
			updateOrderMutation.mutate({
				orderId,
				body: { status }
			});
		},
		[orderId, updateOrderMutation]
	);

	return (
		<View style={actionsStyles.container}>
			{status === OrderStatus.Pending && (
				<Button
					text='Mark as ready for pickup'
					loading={updateOrderMutation.isPending}
					onPress={onConfirmReadyForPickup}
				/>
			)}

			<Spacer y={8} />

			{status !== OrderStatus.Cancelled && status !== OrderStatus.Completed && (
				<Button
					loading={updateOrderMutation.isPending}
					variant='destructive'
					onPress={confirmCancel}
					text='Cancel Order'
				/>
			)}
		</View>
	);
};

const actionsStyles = StyleSheet.create({
	container: {
		paddingVertical: 16
	}
});

// NOTE: StatusPill is currently unused anywhere in the app. Kept here when the
// order components were inlined; safe to delete.
const StatusColorMap = {
	[OrderStatus.Cancelled]: 'danger',
	[OrderStatus.Completed]: 'success',
	[OrderStatus.Pending]: 'warning',
	[OrderStatus.PaymentPending]: 'warning',
	[OrderStatus.ReadyForPickup]: 'warning'
} as const;

interface StatusPillProps {
	status: OrderStatus;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => (
	<Badge variant={StatusColorMap[status]} text={status} />
);

export default Order;
