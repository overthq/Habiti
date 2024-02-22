import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
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
	return (
		<View style={styles.container}>
			<Typography weight='medium' style={styles.sectionHeader}>
				Payment
			</Typography>
			<View style={styles.row}>
				<Typography>Total</Typography>
				<Typography>{formatNaira(order.total)}</Typography>
			</View>
			<View style={styles.row}>
				<Typography>Fees</Typography>
				<Typography>{formatNaira(5000)}</Typography>
			</View>
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
