import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Spacer, Typography } from '@habiti/components';

import { useUpdateOrderMutation } from '../../data/mutations';
import { OrderStatus } from '../../data/types';

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
		[orderId, status]
	);

	return (
		<View style={styles.container}>
			{status === OrderStatus.Pending && (
				<Button
					text='Mark as ready for pickup'
					loading={updateOrderMutation.isPending}
					onPress={onConfirmReadyForPickup}
				/>
			)}
			{status === OrderStatus.ReadyForPickup && (
				<Typography variant='secondary' style={styles.awaitingText}>
					Awaiting customer pickup
				</Typography>
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

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	button: {
		marginBottom: 8
	},
	awaitingText: {
		textAlign: 'center',
		paddingVertical: 8
	}
});

export default OrderActions;
