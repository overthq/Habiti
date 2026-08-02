import React from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import {
	Icon,
	Row,
	Screen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';
import { formatNairaAbbreviated } from '@habiti/common';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HeaderButton } from '@react-navigation/elements';
import { FlashList } from '@shopify/flash-list';

import useRefresh from '../hooks/useRefresh';
import { parseTimestamp } from '../utils/date';
import { useCurrentStoreQuery, useTransactionsQuery } from '../data/queries';
import { Transaction, TransactionStatus, TransactionType } from '../data/types';
import {
	AppStackParamList,
	type StoreStackParamList
} from '../navigation/types';

const Transactions = () => {
	const { data: storeData } = useCurrentStoreQuery();
	const { data, refetch, isRefetching } = useTransactionsQuery();
	const { isRefreshing, onRefresh } = useRefresh({ refetch, isRefetching });
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();
	const { theme } = useTheme();

	const handleAddPayout = React.useCallback(() => {
		if (!storeData?.store) return;

		if (!storeData.store.bankAccountNumber) {
			Alert.alert(
				'No bank account linked',
				'You must link a bank account before requesting a payout'
			);

			return;
		}

		navigate('Modal.AddPayout', {
			realizedRevenue: storeData?.store.realizedRevenue ?? 0,
			paidOut: storeData?.store.paidOut ?? 0
		});
	}, [storeData, navigate]);

	React.useLayoutEffect(() => {
		setOptions({
			headerRight: () => (
				<HeaderButton onPress={handleAddPayout}>
					<Icon name='plus' />
				</HeaderButton>
			),
			unstable_headerRightItems: () => [
				{
					type: 'button',
					label: 'Add',
					icon: { type: 'sfSymbol', name: 'plus' },
					onPress: handleAddPayout
				}
			]
		});
	}, [setOptions, handleAddPayout]);

	const handleTransactionPress = React.useCallback(
		(transaction: Transaction) => {
			navigate('Transaction', {
				transactionId: transaction.id
			});
		},
		[navigate]
	);

	const renderTransaction = React.useCallback(
		({ item, index }: { item: Transaction; index: number }) => (
			<TransactionRow
				transaction={item}
				onPress={handleTransactionPress}
				isLast={index === (data?.transactions.length ?? 0) - 1}
			/>
		),
		[handleTransactionPress, data?.transactions.length]
	);

	const refreshControl = React.useMemo(
		() => (
			<RefreshControl
				refreshing={isRefreshing}
				onRefresh={onRefresh}
				tintColor={theme.text.secondary}
			/>
		),
		[isRefreshing, onRefresh, theme.text.secondary]
	);

	return (
		<Screen style={styles.screen}>
			<View style={styles.container}>
				<FlashList
					contentContainerStyle={{
						flexGrow: 1,
						backgroundColor: theme.screen.background
					}}
					refreshControl={refreshControl}
					data={data?.transactions ?? []}
					keyExtractor={t => t.id}
					renderItem={renderTransaction}
					ListEmptyComponent={
						<View style={styles.empty}>
							<Typography variant='secondary'>No transactions yet</Typography>
						</View>
					}
				/>
			</View>
		</Screen>
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
		<Row
			style={[
				styles.row,
				!isLast && {
					borderColor: theme.border.color,
					borderBottomWidth: StyleSheet.hairlineWidth
				}
			]}
			onPress={() => onPress(transaction)}
		>
			<View style={styles.left}>
				<Typography weight='medium' style={{ fontSize: 15 }} numberOfLines={1}>
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
			<View style={styles.right}>
				<Typography size='small' weight='medium'>
					{credit ? '+' : '-'}
					{formatNairaAbbreviated(transaction.amount)}
				</Typography>
				<Icon name='chevron-right' size={16} color={theme.text.secondary} />
			</View>
		</Row>
	);
};

const styles = StyleSheet.create({
	screen: {
		// Rows carry their own horizontal padding, so the pressed state and the
		// separators run the full width of the screen.
		paddingHorizontal: 0
	},
	container: {
		flex: 1
	},
	empty: {
		paddingVertical: 32,
		paddingHorizontal: 16,
		alignItems: 'center'
	},
	row: {
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

export default Transactions;
