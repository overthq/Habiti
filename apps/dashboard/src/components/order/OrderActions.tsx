import { Button } from '@market/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useUpdateOrderMutation, OrderStatus } from '../../types/api';

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, status }) => {
	const [{ fetching }, updateOrder] = useUpdateOrderMutation();

	const updateOrderStatus = React.useCallback(
		(status: OrderStatus) => () => {
			try {
				updateOrder({ orderId, input: { status } });
			} catch (error) {
				console.log(error);
			}
		},
		[orderId, status]
	);

	return (
		<View style={styles.container}>
			{status !== OrderStatus.Completed && (
				<Button
					text='Mark as fulfilled'
					loading={fetching}
					onPress={updateOrderStatus(OrderStatus.Completed)}
					style={styles.button}
				/>
			)}
			{status !== OrderStatus.Cancelled && (
				<Button
					style={styles.button}
					loading={fetching}
					variant='secondary'
					onPress={updateOrderStatus(OrderStatus.Cancelled)}
					text='Refund'
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	button: {
		marginBottom: 8
	}
});

export default OrderActions;
