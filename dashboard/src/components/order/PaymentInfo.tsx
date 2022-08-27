import React from 'react';
import { View, Text } from 'react-native';
import { OrderQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

interface PaymentInfoProps {
	order: OrderQuery['order'];
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ order }) => {
	return (
		<View>
			<View style={{ marginTop: 8, paddingLeft: 16 }}>
				<Text style={{ fontSize: 16 }}>Total: {formatNaira(order.total)}</Text>
			</View>
		</View>
	);
};

export default PaymentInfo;
