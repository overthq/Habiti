import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Typography, Spacer, useTheme } from '@habiti/components';
import { formatNaira } from '@habiti/common';
import { RouteProp, useRoute } from '@react-navigation/native';

import { parseTimestamp } from '../utils/date';
import { useTransactionQuery } from '../data/queries';
import { TransactionStatus, TransactionType } from '../data/types';
import type { StoreStackParamList } from '../types/navigation';

const CREDIT_TYPES: TransactionType[] = [
	TransactionType.Revenue,
	TransactionType.Adjustment,
	TransactionType.Refund
];

const transactionLabel: Record<TransactionType, string> = {
	[TransactionType.Revenue]: 'Payment received',
	[TransactionType.Payout]: 'Payout',
	[TransactionType.SubscriptionFee]: 'Subscription fee',
	[TransactionType.Adjustment]: 'Adjustment',
	[TransactionType.Refund]: 'Refund'
};

const statusColor: Record<TransactionStatus, string> = {
	[TransactionStatus.Processing]: '#F59E0B',
	[TransactionStatus.Success]: '#10B981',
	[TransactionStatus.Failure]: '#EF4444'
};

const TransactionDetail = () => {
	const {
		params: { transactionId }
	} = useRoute<RouteProp<StoreStackParamList, 'TransactionDetail'>>();
	const { data } = useTransactionQuery(transactionId);
	const { theme } = useTheme();

	if (!data) {
		return <View />;
	}

	const { transaction } = data;
	const credit = CREDIT_TYPES.includes(transaction.type);

	return (
		<Screen>
			<View style={styles.container}>
				<View style={styles.amountSection}>
					<Typography
						size='xxxlarge'
						weight='bold'
						style={{
							color: credit ? theme.badge.success.color : theme.text.primary
						}}
					>
						{credit ? '+' : '-'}
						{formatNaira(transaction.amount)}
					</Typography>
					<Spacer y={4} />
					<Typography variant='secondary'>
						{transactionLabel[transaction.type]}
					</Typography>
				</View>

				<Spacer y={16} />

				<DetailRow label='Date' value={parseTimestamp(transaction.createdAt)} />
				<DetailRow label='Type' value={transactionLabel[transaction.type]} />
				<DetailRow label='Status' value={transaction.status} />
				{transaction.description && (
					<DetailRow label='Description' value={transaction.description} />
				)}
				<DetailRow
					label='Balance After'
					value={formatNaira(transaction.balanceAfter)}
				/>
				{transaction.orderId && (
					<DetailRow label='Order ID' value={transaction.orderId} />
				)}
			</View>
		</Screen>
	);
};

interface DetailRowProps {
	label: string;
	value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
	<View style={styles.detailRow}>
		<Typography variant='secondary' size='small'>
			{label}
		</Typography>
		<Spacer y={2} />
		<Typography>{value}</Typography>
		<Spacer y={12} />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 16
	},
	amountSection: {
		alignItems: 'center',
		paddingVertical: 16
	},
	detailRow: {}
});

export default TransactionDetail;
