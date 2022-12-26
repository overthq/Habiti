import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
	OrderQuery,
	OrderStatus,
	useUpdateOrderMutation
} from '../../types/api';
import { formatNaira } from '../../utils/currency';
import Button from '../global/Button';

interface PaymentInfoProps {
	order: OrderQuery['order'];
}

// This should show the payment details for the order.
// - Sub total (plain cost of products)
// - Discounts or coupons, if any
// - Fee breakdown (payment provider and ours).
// - Tax (VAT and otherwise)
// - Total
// - Refund button (should this be different from order cancellation?)

const PaymentInfo: React.FC<PaymentInfoProps> = ({ order }) => {
	const [{ fetching }, updateOrder] = useUpdateOrderMutation();

	const handleRefund = React.useCallback(() => {
		// For now, this is equivalent to order cancellation.
		updateOrder({
			orderId: order.id,
			input: { status: OrderStatus.Cancelled }
		});
	}, [order.id]);

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Payment</Text>
			<View style={styles.row}>
				<Text style={styles.text}>Total</Text>
				<Text style={styles.text}>{formatNaira(order.total)}</Text>
			</View>
			<Button
				style={styles.button}
				loading={fetching}
				variant='secondary'
				onPress={handleRefund}
				text='Refund'
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 8
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4
	},
	text: {
		fontSize: 16
	},
	button: {
		marginTop: 4
	}
});

export default PaymentInfo;
