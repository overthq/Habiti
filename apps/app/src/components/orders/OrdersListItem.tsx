import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Avatar, Row, Spacer, Typography } from '@habiti/components';

import { UserOrdersQuery } from '../../types/api';

interface OrdersListItemProps {
	order: UserOrdersQuery['currentUser']['orders'][number];
	onPress(): void;
}

const OrdersListItem: React.FC<OrdersListItemProps> = ({ order, onPress }) => {
	return (
		<Row onPress={onPress}>
			<View>
				<View style={styles.container}>
					<Avatar
						uri={order.store.image?.path}
						fallbackText={order.store.name}
						size={40}
					/>
					<Typography>{order.store.name}</Typography>
				</View>
				<Spacer y={8} />
				<View style={styles.products}>
					{order.products.map(product => (
						<View key={product.product.id}>
							<Image
								source={{ uri: product.product.images?.[0].path }}
								style={styles.productImage}
							/>
						</View>
					))}
				</View>
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	products: {
		flexDirection: 'row',
		gap: 8
	},
	productImage: {
		width: 48,
		height: 48,
		borderRadius: 6
	}
});

export default OrdersListItem;
