import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

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
			<Text style={styles.sectionHeader}>Payment</Text>
			<View style={{ marginTop: 8 }}>
				<Text style={{ fontSize: 16 }}>Total: {formatNaira(order.total)}</Text>
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
		fontSize: 16,
		fontWeight: '500'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default PaymentInfo;
