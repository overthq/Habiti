import React from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '../global/Button';
import { useUpdateOrderMutation, OrderStatus } from '../../types/api';

// Important:
// - Both button loading states should not be attached to "fetching".
// - Breakdown what buttons to display and when:
//   - When the order is pending, display "Mark as fulfilled" and "Cancel".
//   - When the order is cancelled, display a lone "undo cancel"?
//   - When the order is pending delivery, display nothing?
//   - When the order is delivered, display a delivered notice.
// - What do we display when the order is returned.
// - ^ (that should also be an order status)

interface OrderActionsProps {
	orderId: string;
	status: OrderStatus;
}

const OrderActions: React.FC<OrderActionsProps> = ({ orderId }) => {
	const [{ fetching }, updateOrder] = useUpdateOrderMutation();

	const updateOrderStatus = (status: OrderStatus) =>
		React.useCallback(() => {
			try {
				updateOrder({ orderId, input: { status } });
			} catch (error) {
				console.log(error);
			}
		}, []);

	return (
		<View style={styles.container}>
			<Button
				text='Mark as fulfilled'
				loading={fetching}
				onPress={updateOrderStatus(OrderStatus.Completed)}
				style={{ marginRight: 16, height: 40, backgroundColor: '#505050' }}
			/>
			<Button
				text='Cancel'
				onPress={updateOrderStatus(OrderStatus.Cancelled)}
				style={{ height: 40 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flexDirection: 'row'
	}
});

export default OrderActions;
