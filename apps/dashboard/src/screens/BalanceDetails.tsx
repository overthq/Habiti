import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { formatNaira, formatNairaAbbreviated } from '@habiti/common';
import {
	Icon,
	ScrollableScreen,
	SectionHeader,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { parseTimestamp } from '../utils/date';
import { useStoreBalanceQuery, useTransactionsQuery } from '../data/queries';
import { Transaction, TransactionStatus, TransactionType } from '../data/types';
import type {
	AppStackParamList,
	StoreStackParamList
} from '../navigation/types';

const BalanceDetails = () => {
	const { data } = useStoreBalanceQuery();
	const { theme } = useTheme();

	if (!data?.balance) {
		return <View />;
	}

	const { realizedRevenue, unrealizedRevenue, pendingPayouts, available } =
		data.balance;

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<View style={[styles.list, { backgroundColor: theme.input.background }]}>
				<BalanceRow label='Available' amount={available} />
				{pendingPayouts > 0 && (
					<BalanceRow label='Pending payouts' amount={pendingPayouts} />
				)}
				<BalanceRow label='Realized revenue' amount={realizedRevenue} />
				<BalanceRow
					label='Unrealized revenue'
					amount={unrealizedRevenue}
					isLast
				/>
			</View>

			<Spacer y={16} />

			<Separator />

			<Spacer y={16} />

			<RecentTransactions />
		</ScrollableScreen>
	);
};

interface BalanceRowProps {
	label: string;
	amount: number;
	isLast?: boolean;
}

const BalanceRow: React.FC<BalanceRowProps> = ({ label, amount, isLast }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.row,
				!isLast
					? {
							borderBottomWidth: StyleSheet.hairlineWidth,
							borderColor: theme.border.color
						}
					: {}
			]}
		>
			<Typography style={{ fontSize: 15 }}>{label}</Typography>
			<Typography weight='medium' style={{ fontSize: 15 }}>
				{formatNaira(amount)}
			</Typography>
		</View>
	);
};

const styles = StyleSheet.create({
	list: {
		borderRadius: 12,
		paddingHorizontal: 12
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12
	}
});

const RecentTransactions = () => {
	const { data } = useTransactionsQuery();
	const { navigate } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();
	const { theme } = useTheme();

	const recentTransactions = React.useMemo(
		() => (data?.transactions ?? []).slice(0, 3),
		[data?.transactions]
	);

	const handleViewAll = React.useCallback(() => {
		navigate('Transactions');
	}, [navigate]);

	const handleTransactionPress = React.useCallback(
		(transaction: Transaction) => {
			navigate('Transaction', { transactionId: transaction.id });
		},
		[navigate]
	);

	return (
		<View>
			<SectionHeader
				title='Recent Transactions'
				padded={false}
				action={{ text: 'View all', onPress: handleViewAll }}
			/>
			<View
				style={[recentStyles.list, { backgroundColor: theme.input.background }]}
			>
				{recentTransactions.length === 0 ? (
					<View style={recentStyles.empty}>
						<Typography variant='secondary'>No transactions yet</Typography>
					</View>
				) : (
					recentTransactions.map((transaction, index) => (
						<TransactionRow
							key={transaction.id}
							transaction={transaction}
							isLast={index === recentTransactions.length - 1}
							onPress={handleTransactionPress}
						/>
					))
				)}
			</View>
		</View>
	);
};

interface TransactionRowProps {
	transaction: Transaction;
	isLast: boolean;
	onPress(transaction: Transaction): void;
}

const CREDIT_TYPES: TransactionType[] = [
	TransactionType.Revenue,
	TransactionType.Adjustment,
	TransactionType.Refund
];

const transactionLabel: Record<TransactionType, string> = {
	[TransactionType.Revenue]: 'Payment received',
	[TransactionType.Payout]: 'Payout',
	[TransactionType.SubscriptionFee]: 'Platform fee',
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
	const credit = CREDIT_TYPES.includes(transaction.type);

	return (
		<Pressable
			style={[
				recentStyles.row,
				!isLast && {
					borderColor: theme.border.color,
					borderBottomWidth: StyleSheet.hairlineWidth
				}
			]}
			onPress={() => onPress(transaction)}
		>
			<View style={recentStyles.left}>
				<Typography weight='medium' style={{ fontSize: 15 }} numberOfLines={1}>
					{transaction.description ?? transactionLabel[transaction.type]}
				</Typography>
				<Spacer y={2} />
				<View style={recentStyles.meta}>
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
			<View style={recentStyles.right}>
				<Typography size='small' weight='medium'>
					{credit ? '+' : '-'}
					{formatNairaAbbreviated(transaction.amount)}
				</Typography>
				<Icon name='chevron-right' size={16} color={theme.text.secondary} />
			</View>
		</Pressable>
	);
};

const recentStyles = StyleSheet.create({
	list: {
		borderRadius: 12,
		overflow: 'hidden',
		marginTop: 8,
		paddingHorizontal: 12
	},
	empty: {
		paddingVertical: 16,
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 12
	},
	left: {
		flex: 1,
		marginRight: 12
	},
	meta: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	right: {
		flexDirection: 'row',
		gap: 4
	}
});

export default BalanceDetails;
