import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionHeader, Typography, useTheme } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import TransactionRow from '../transactions/TransactionRow';
import { useTransactionsQuery } from '../../data/queries';
import { Transaction } from '../../data/types';
import type {
	AppStackParamList,
	StoreStackParamList
} from '../../types/navigation';

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
	}, []);

	const handleTransactionPress = React.useCallback(
		(transaction: Transaction) => {
			navigate('Transaction', { transactionId: transaction.id });
		},
		[]
	);

	return (
		<View>
			<SectionHeader
				title='Recent Transactions'
				padded={false}
				action={{ text: 'View all', onPress: handleViewAll }}
			/>
			<View style={[styles.list, { backgroundColor: theme.input.background }]}>
				{recentTransactions.length === 0 ? (
					<View style={styles.empty}>
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

const styles = StyleSheet.create({
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

export default RecentTransactions;
