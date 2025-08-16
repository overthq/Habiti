import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { HoldableButton, Spacer } from '@habiti/components';

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
				onPress: updateOrderStatus(OrderStatus.Cancelled)
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
				<HoldableButton
					text='Mark as fulfilled'
					loading={fetching}
					onComplete={updateOrderStatus(OrderStatus.Completed)}
				/>
			)}
			<Spacer y={8} />
			{status !== OrderStatus.Cancelled && (
				<HoldableButton
					loading={fetching}
					variant='destructive'
					onComplete={confirmCancel}
					text='Cancel Order'
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
