import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Spacer } from '@habiti/components';

import { useUpdateOrderMutation } from '../../data/mutations';
import { OrderStatus } from '../../data/types';

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, status }) => {
	const updateOrderMutation = useUpdateOrderMutation();

	const onConfirmFulfill = () => {
		Alert.alert(
			'Fulfill order',
			'Are you sure you want to fulfill this order',
			[
				{
					text: 'Fulfill',
					onPress: updateOrderStatus(OrderStatus.Completed)
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
		[orderId, status]
	);

	return (
		<View style={styles.container}>
			{status !== OrderStatus.Completed && (
				<Button
					text='Mark as fulfilled'
					loading={updateOrderMutation.isPending}
					onPress={onConfirmFulfill}
				/>
			)}
			<Spacer y={8} />
			{status !== OrderStatus.Cancelled && (
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

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	button: {
		marginBottom: 8
	}
});

export default OrderActions;
