import React from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../global/Button';
import { useUpdateOrderMutation, OrderStatus } from '../../types/api';

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId, status }) => {
	const [{ fetching }, updateOrder] = useUpdateOrderMutation();

	const updateOrderStatus = React.useCallback(
		(status: OrderStatus) => async () => {
			try {
				const { data, error } = await updateOrder({
					orderId,
					input: { status }
				});

				console.log({ data, error });
			} catch (error) {
				console.log(error);
			}
		},
		[]
	);

	if (status !== OrderStatus.Pending) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Button
				text='Mark as fulfilled'
				loading={fetching}
				onPress={updateOrderStatus(OrderStatus.Completed)}
				style={styles.button}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flexDirection: 'row'
	},
	button: {
		height: 40
	}
});

export default OrderActions;
