import { Button } from '@habiti/components';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { useUpdateOrderMutation, OrderStatus } from '../../types/api';

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, status }) => {
	const [{ fetching }, updateOrder] = useUpdateOrderMutation();

	const confirmCancel = () => {
		Alert.alert('Cancel order', 'Are you sure you want to cancel this order', [
			{
				text: 'Proceed',
				style: 'destructive',
				onPress: () => {
					updateOrderStatus(OrderStatus.Cancelled)();
				}
			},
			{ text: 'Cancel', style: 'cancel' }
		]);
	};

	const updateOrderStatus = React.useCallback(
		(status: OrderStatus) => async () => {
			const { error } = await updateOrder({ orderId, input: { status } });

			if (error) {
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
					variant='destructive'
					onPress={confirmCancel}
					text='Cancel order'
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
