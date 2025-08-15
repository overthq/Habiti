import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';
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
				<Typography>{formatNaira(payout.amount)}</Typography>
				<Spacer y={2} />
				<Typography variant='secondary' size='small'>
					{parseTimestamp(payout.createdAt)}
				</Typography>
			</View>
			<PayoutStatusPill status={payout.status} />
		</View>
	);
};

interface PayoutStatusPillProps {
	status: PayoutStatus;
}

const statusToBadgeVariant = {
	[PayoutStatus.Success]: 'success',
	[PayoutStatus.Pending]: 'warning',
	[PayoutStatus.Failure]: 'danger'
} as const;

const PayoutStatusPill: React.FC<PayoutStatusPillProps> = ({ status }) => {
	const { theme } = useTheme();
	const { color, backgroundColor } = theme.badge[statusToBadgeVariant[status]];

	return (
		<View style={[styles.pill, { backgroundColor }]}>
			<Typography size='xsmall' weight='medium' style={{ color }}>
				{status}
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
	},
	pill: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
		alignSelf: 'flex-start',
		width: 66,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default PayoutRow;
