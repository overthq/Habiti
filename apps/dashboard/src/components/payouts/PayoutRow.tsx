import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacer, Typography } from '@habiti/components';
import { formatNaira } from '@habiti/common';

import { StorePayoutsQuery, PayoutStatus } from '../../types/api';
import { parseTimestamp } from '../../utils/date';

interface PayoutRowProps {
	payout: StorePayoutsQuery['currentStore']['payouts'][number];
}

const PayoutRow: React.FC<PayoutRowProps> = ({ payout }) => {
	return (
		<View style={styles.container}>
			<View>
				<PayoutStatusPill status={payout.status} />
				<Spacer y={4} />
				<Typography>{formatNaira(payout.amount)}</Typography>
			</View>
			<Typography variant='label'>
				{parseTimestamp(payout.createdAt)}
			</Typography>
		</View>
	);
};

interface PayoutStatusPillProps {
	status: PayoutStatus;
}

const PayoutStatusPill: React.FC<PayoutStatusPillProps> = ({ status }) => {
	return (
		<View style={styles.pill}>
			<Typography>{status}</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8
	},
	pill: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4
	}
});

export default PayoutRow;
