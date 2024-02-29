import React from 'react';
import { View } from 'react-native';
import Typography from '../global/Typography';
import { formatNaira } from '../../utils/currency';
import { StorePayoutsQuery } from '../../types/api';

interface PayoutRowProps {
	payout: StorePayoutsQuery['currentStore']['payouts'][number];
}

const PayoutRow: React.FC<PayoutRowProps> = ({ payout }) => {
	return (
		<View>
			<Typography>{formatNaira(payout.amount)}</Typography>
			<Typography>{payout.createdAt}</Typography>
		</View>
	);
};

export default PayoutRow;
