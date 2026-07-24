import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	CustomImage,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import { useCustomerInfoQuery } from '../data/queries';
import { parseTimestamp } from '../utils/date';
import { plural } from '../utils/strings';
import type { OrdersStackScreenProps } from '../navigation/types';
import type { Order } from '../data/types';

const CustomerInfo: React.FC<OrdersStackScreenProps<'CustomerInfo'>> = ({
	navigation,
	route
}) => {
	const { params } = route;
	const { data, isLoading } = useCustomerInfoQuery(params.userId);

	const handleOrderPress = (id: string) => {
		navigation.navigate('Order', { orderId: id });
	};

	if (isLoading || !data) {
		return <View />;
	}

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<Typography weight='medium' size='xlarge'>
				{data.user.name}
			</Typography>
			<Spacer y={2} />
			<Typography variant='secondary'>{data.user.email}</Typography>
			<Spacer y={12} />
			<Typography weight='medium'>Previous Orders</Typography>
			{data.user.orders.map(order => (
				<OrderDetail
					key={order.id}
					order={order}
					onPress={() => handleOrderPress(order.id)}
				/>
			))}
		</ScrollableScreen>
	);
};

interface OrderDetailProps {
	order: Order;
	onPress(): void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onPress }) => {
	const { theme } = useTheme();

	return (
		<Pressable
			style={[
				styles.container,
				{ borderBottomWidth: 1, borderColor: theme.border.color }
			]}
			onPress={onPress}
		>
			<View style={styles.header}>
				<View style={styles.headerText}>
					<Typography size='small'>{formatNaira(order.total)}</Typography>
					<Typography size='small' variant='secondary' weight='medium'>
						·
					</Typography>
					<Typography size='small'>
						{parseTimestamp(order.createdAt)}
					</Typography>
					<Typography size='small' variant='secondary' weight='medium'>
						·
					</Typography>
					<Typography size='small' variant='secondary'>
						{plural('item', order.products.length)}
					</Typography>
				</View>
			</View>

			<Spacer y={8} />

			<View style={styles.row}>
				{order.products.slice(0, 3).map((product, index) => (
					<View
						key={product.productId}
						style={[
							styles.item,
							index === order.products.slice(0, 3).length - 1 && styles.lastItem
						]}
					>
						<CustomImage
							uri={product.product.images[0]?.path}
							height={48}
							width={48}
							style={styles.image}
						/>
					</View>
				))}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	headerText: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4
	},
	row: {
		flexDirection: 'row'
	},
	item: {
		marginRight: 8
	},
	lastItem: {
		marginRight: 0
	},
	image: {
		borderRadius: 4
	}
});

export default CustomerInfo;
