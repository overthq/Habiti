import { formatNaira } from '@market/common';
import { Typography } from '@market/components';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { StorePayoutsQuery } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface PayoutRowProps {
	payout: StorePayoutsQuery['currentStore']['payouts'][number];
}

const PayoutRow: React.FC<PayoutRowProps> = ({ payout }) => {
	return (
		<View style={styles.container}>
			<Typography>{formatNaira(payout.amount)}</Typography>
			<Typography variant='label'>
				{parseTimestamp(payout.createdAt)}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8
	}
});

export default PayoutRow;
