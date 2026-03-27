import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Spacer, Typography, useTheme } from '@habiti/components';
import { formatNaira } from '@habiti/common';

import { parseTimestamp } from '../../utils/date';
import {
	Transaction,
	TransactionStatus,
	TransactionType
} from '../../data/types';

interface TransactionRowProps {
	transaction: Transaction;
	isLast: boolean;
	onPress?: (transaction: Transaction) => void;
}

const CREDIT_TYPES: TransactionType[] = [
	TransactionType.Revenue,
	TransactionType.Adjustment,
	TransactionType.Refund
];

const isCredit = (type: TransactionType) => CREDIT_TYPES.includes(type);

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

const TransactionRow: React.FC<TransactionRowProps> = ({
	transaction,
	isLast,
	onPress
}) => {
	const { theme } = useTheme();
	const credit = isCredit(transaction.type);

	return (
		<Pressable
			style={[
				styles.container,
				!isLast
					? {
							borderColor: theme.border.color,
							borderBottomWidth: StyleSheet.hairlineWidth
						}
					: {}
			]}
			onPress={() => onPress?.(transaction)}
		>
			<View style={styles.left}>
				<Typography weight='medium' size='small'>
					{transaction.description ?? transactionLabel[transaction.type]}
				</Typography>
				<Spacer y={2} />
				<View style={styles.meta}>
					<Typography variant='secondary' size='small'>
						{parseTimestamp(transaction.createdAt)}
					</Typography>
					{transaction.status !== TransactionStatus.Success && (
						<Typography
							size='small'
							weight='medium'
							style={{ color: statusColor[transaction.status], marginLeft: 8 }}
						>
							{transaction.status}
						</Typography>
					)}
				</View>
			</View>
			<Typography
				size='small'
				weight='medium'
				style={{
					color: credit ? theme.badge.success.color : theme.text.primary
				}}
			>
				{credit ? '+' : '-'}
				{formatNaira(transaction.amount)}
			</Typography>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12
	},
	left: {
		flex: 1,
		marginRight: 12
	},
	meta: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});

export default TransactionRow;
