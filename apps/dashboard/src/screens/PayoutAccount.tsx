import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Button, Screen, Spacer, Typography } from '@habiti/components';

import { usePayoutAccountsQuery } from '../data/queries';
import { useDeletePayoutAccountMutation } from '../data/mutations';
import { BANKS_BY_CODE } from '../utils/transform';
import { StoreStackScreenProps } from '../navigation/types';

interface DetailProps {
	label: string;
	value?: string | null;
}

const Detail: React.FC<DetailProps> = ({ label, value }) => (
	<View style={styles.detail}>
		<Typography variant='secondary' size='small'>
			{label}
		</Typography>
		<Typography weight='medium'>{value ?? '—'}</Typography>
	</View>
);

const PayoutAccount: React.FC<StoreStackScreenProps<'PayoutAccount'>> = ({
	navigation
}) => {
	const { data, isLoading, refetch } = usePayoutAccountsQuery();
	const deletePayoutAccountMutation = useDeletePayoutAccountMutation();

	const account = data?.payoutAccounts?.[0];

	const handleAdd = React.useCallback(() => {
		navigation.navigate('Modal.AddPayoutAccount');
	}, [navigation]);

	const handleUpdate = React.useCallback(() => {
		Alert.alert(
			'Replace payout account',
			'Adding a new account will replace the one you have now. Future payouts will go to the new account.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Continue', onPress: handleAdd }
			]
		);
	}, [handleAdd]);

	const removeAccount = React.useCallback(async () => {
		if (!account) return;

		try {
			await deletePayoutAccountMutation.mutateAsync(account.id);
			refetch();
		} catch {
			Alert.alert(
				'Could not remove account',
				'This account may have a payout awaiting confirmation. Please try again once it has settled.'
			);
		}
	}, [account, deletePayoutAccountMutation, refetch]);

	const handleRemove = React.useCallback(() => {
		Alert.alert(
			'Remove account',
			'Are you sure you want to remove your payout account?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Remove', onPress: removeAccount, style: 'destructive' }
			]
		);
	}, [removeAccount]);

	if (isLoading) return <Screen />;

	if (!account) {
		return (
			<Screen>
				<Spacer y={16} />
				<Typography weight='medium' size='large'>
					No payout account set up
				</Typography>
				<Spacer y={8} />
				<Typography variant='secondary'>
					Add a bank account so you can withdraw your earnings.
				</Typography>
				<Spacer y={16} />
				<Button text='Add payout account' onPress={handleAdd} />
			</Screen>
		);
	}

	// Accounts added since the payout-account table exists carry the bank name
	// the provider resolved. Rows backfilled from the old store columns do not,
	// so fall back to the local code lookup.
	const bankName = account.bankName ?? BANKS_BY_CODE[account.bankCode]?.name;

	return (
		<Screen>
			<Spacer y={16} />
			<View style={styles.details}>
				<Detail label='Account Name' value={account.accountName} />
				<Detail label='Bank' value={bankName} />
				<Detail label='Account Number' value={account.accountNumber} />
			</View>
			<Spacer y={24} />
			<Button text='Replace account' onPress={handleUpdate} />
			<Spacer y={12} />
			<Button
				text='Remove account'
				variant='destructive'
				onPress={handleRemove}
				loading={deletePayoutAccountMutation.isPending}
			/>
		</Screen>
	);
};

const styles = StyleSheet.create({
	details: {
		gap: 16
	},
	detail: {
		gap: 4
	}
});

export default PayoutAccount;
