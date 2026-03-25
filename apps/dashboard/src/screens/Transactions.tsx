import React from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import {
	Screen,
	ScreenHeader,
	Typography,
	Spacer,
	useTheme
} from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TransactionRow from '../components/transactions/TransactionRow';
import useGoBack from '../hooks/useGoBack';
import { useCurrentStoreQuery, useTransactionsQuery } from '../data/queries';
import { Transaction } from '../data/types';
import type { StoreStackParamList } from '../types/navigation';

const Transactions = () => {
	const { data: storeData } = useCurrentStoreQuery();
	const { data, refetch, isRefetching } = useTransactionsQuery();
	const { navigate } = useNavigation<NavigationProp<StoreStackParamList>>();
	const { theme } = useTheme();
	const { top } = useSafeAreaInsets();

	useGoBack();

	const handleTransactionPress = React.useCallback(
		(transaction: Transaction) => {
			navigate('TransactionDetail', {
				transactionId: transaction.id
			});
		},
		[]
	);

	const availableBalance = storeData
		? storeData.store.realizedRevenue - storeData.store.paidOut
		: 0;

	return (
		<Screen>
			<View style={styles.container}>
				<FlashList
					contentContainerStyle={{
						flexGrow: 1,
						backgroundColor: theme.screen.background
					}}
					refreshControl={
						<RefreshControl
							refreshing={isRefetching}
							onRefresh={refetch}
							tintColor={theme.text.secondary}
						/>
					}
					ListHeaderComponent={
						<View style={styles.header}>
							<Typography variant='secondary' size='small'>
								Available Balance
							</Typography>
							<Spacer y={4} />
							<Typography size='xxxlarge' weight='bold'>
								{formatNaira(availableBalance)}
							</Typography>
						</View>
					}
					data={data?.transactions ?? []}
					keyExtractor={t => t.id}
					renderItem={({ item }) => (
						<TransactionRow
							transaction={item}
							onPress={handleTransactionPress}
						/>
					)}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16
	},
	header: {
		paddingVertical: 16
	},
	empty: {
		paddingVertical: 32,
		alignItems: 'center'
	}
});

export default Transactions;
