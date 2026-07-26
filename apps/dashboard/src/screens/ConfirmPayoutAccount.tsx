import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Button,
	ScrollableScreen,
	Spacer,
	Typography
} from '@habiti/components';

import { useUpdateCurrentStoreMutation } from '../data/mutations';
import { BANKS_BY_CODE } from '../utils/transform';
import { PayoutAccountStackScreenProps } from '../navigation/types';

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

const ConfirmPayoutAccount: React.FC<
	PayoutAccountStackScreenProps<'PayoutAccount.Confirm'>
> = ({ navigation, route }) => {
	const { bankCode, accountNumber, accountName } = route.params;
	const updateStoreMutation = useUpdateCurrentStoreMutation();

	const bankName = BANKS_BY_CODE[bankCode]?.name;

	const onConfirm = React.useCallback(async () => {
		await updateStoreMutation.mutateAsync({
			bankAccountNumber: accountNumber,
			bankCode
		});

		navigation.getParent()?.goBack();
	}, [accountNumber, bankCode, updateStoreMutation, navigation]);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<Typography weight='medium'>
				Please confirm these details before saving your payout account.
			</Typography>
			<Spacer y={16} />
			<View style={styles.details}>
				<Detail label='Account Name' value={accountName} />
				<Detail label='Account Number' value={accountNumber} />
				<Detail label='Bank' value={bankName} />
			</View>
			<Spacer y={16} />
			<Button
				text='Confirm details'
				onPress={onConfirm}
				loading={updateStoreMutation.isPending}
			/>
		</ScrollableScreen>
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

export default ConfirmPayoutAccount;
