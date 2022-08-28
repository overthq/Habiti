import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface PaymentInfoProps {
	order: OrderQuery['order'];
}

// This should show the payment details for the order.
// - Base cost (including sales or offer discounts)
// - Other discounts or coupons, if any
// - Sub total
// - Fee breakdown (payment provider and ours).
// - Total

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
	}
});

export default PaymentInfo;
