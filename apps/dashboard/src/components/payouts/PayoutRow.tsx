import { Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

import { StorePayoutsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';

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
