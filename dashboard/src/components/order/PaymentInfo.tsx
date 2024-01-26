import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	OrderQuery,
	OrderStatus,
	useUpdateOrderMutation
} from '../../types/api';
import { formatNaira } from '../../utils/currency';
import Button from '../global/Button';
import Typography from '../global/Typography';

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
			<Typography weight='medium' style={styles.sectionHeader}>
				Payment
			</Typography>
			<View style={styles.row}>
				<Typography>Total</Typography>
				<Typography>{formatNaira(order.total)}</Typography>
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
		marginBottom: 8
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4
	},
	button: {
		marginTop: 4
	}
});

export default PaymentInfo;
