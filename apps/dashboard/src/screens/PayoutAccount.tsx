import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Button, Screen, Spacer, Typography } from '@habiti/components';

import { useCurrentStoreQuery } from '../data/queries';
import { useUpdateCurrentStoreMutation } from '../data/mutations';
import { BANKS_BY_CODE } from '../utils/transform';
import { StoreStackScreenProps } from '../navigation/types';

interface DetailProps {
	label: string;
	value?: string;
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
	const { data, isLoading, refetch } = useCurrentStoreQuery();
	const updateStoreMutation = useUpdateCurrentStoreMutation();

	const store = data?.store;

	const handleUpdate = React.useCallback(() => {
		navigation.navigate('Modal.AddPayoutAccount');
	}, [navigation]);

	const removeAccount = React.useCallback(async () => {
		await updateStoreMutation.mutateAsync({
			bankAccountNumber: undefined,
			bankCode: undefined
		});

		refetch();
	}, [updateStoreMutation, refetch]);

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

	if (!store?.bankAccountNumber) {
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
				<Button text='Add payout account' onPress={handleUpdate} />
			</Screen>
		);
	}

	const bankName = store.bankCode
		? BANKS_BY_CODE[store.bankCode]?.name
		: undefined;

	return (
		<Screen>
			<Spacer y={16} />
			<View style={styles.details}>
				<Detail label='Bank' value={bankName} />
				<Detail label='Account Number' value={store.bankAccountNumber} />
			</View>
			<Spacer y={24} />
			<Button text='Update details' onPress={handleUpdate} />
			<Spacer y={12} />
			<Button
				text='Remove account'
				variant='destructive'
				onPress={handleRemove}
				loading={updateStoreMutation.isPending}
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
