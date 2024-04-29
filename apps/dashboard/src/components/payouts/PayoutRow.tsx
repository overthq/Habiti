import { Typography } from '@market/components';
import React from 'react';
import { View } from 'react-native';

import { StorePayoutsQuery } from '../../types/api';
import { formatNaira } from '../../utils/currency';
import { parseTimestamp } from '../../utils/date';

interface PayoutRowProps {
	payout: StorePayoutsQuery['currentStore']['payouts'][number];
}

const PayoutRow: React.FC<PayoutRowProps> = ({ payout }) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}
		>
			<Typography>{formatNaira(payout.amount)}</Typography>
			<Typography>{parseTimestamp(payout.createdAt)}</Typography>
		</View>
	);
};

export default PayoutRow;
