import React from 'react';
import { View, StyleSheet } from 'react-native';
import { formatNaira } from '@habiti/common';
import {
	ScrollableScreen,
	SectionHeader,
	Separator,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import TransactionRow from '../components/TransactionRow';
import { useCurrentStoreQuery, useTransactionsQuery } from '../data/queries';
import { Transaction } from '../data/types';
import type {
	AppStackParamList,
	StoreStackParamList
} from '../navigation/types';

const BalanceDetails = () => {
	const { data } = useCurrentStoreQuery();
	const { theme } = useTheme();

	if (!data?.store) {
		return <View />;
	}

	const { realizedRevenue, unrealizedRevenue, paidOut } = data.store;
	const available = (realizedRevenue ?? 0) - (paidOut ?? 0);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<View style={[styles.list, { backgroundColor: theme.input.background }]}>
				<BalanceRow label='Available' amount={available} />
				<BalanceRow label='Realized revenue' amount={realizedRevenue ?? 0} />
				<BalanceRow
					label='Unrealized revenue'
					amount={unrealizedRevenue ?? 0}
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
	}
});

export default BalanceDetails;
