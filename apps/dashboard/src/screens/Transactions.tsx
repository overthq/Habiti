import React from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Screen, Typography, Spacer, useTheme, Icon } from '@habiti/components';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { formatNaira } from '@habiti/common';

import TransactionRow from '../components/transactions/TransactionRow';
import useGoBack from '../hooks/useGoBack';
import { useCurrentStoreQuery, useTransactionsQuery } from '../data/queries';
import { Transaction } from '../data/types';
import {
	AppStackParamList,
	type StoreStackParamList
} from '../types/navigation';
import { HeaderButton } from '@react-navigation/elements';

const Transactions = () => {
	const { data: storeData } = useCurrentStoreQuery();
	const { data, refetch, isRefetching } = useTransactionsQuery();
	const { navigate, setOptions } =
		useNavigation<NavigationProp<AppStackParamList & StoreStackParamList>>();
	const { theme } = useTheme();

	useGoBack();

	const handleAddPayout = React.useCallback(() => {
		if (!storeData.store) return;

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
	}, []);

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
	}, [handleAddPayout]);

	const handleTransactionPress = React.useCallback(
		(transaction: Transaction) => {
			navigate('Transaction', {
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
