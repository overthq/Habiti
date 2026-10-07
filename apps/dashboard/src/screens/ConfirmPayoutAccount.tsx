import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Button,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import { useCreatePayoutAccountMutation } from '../data/mutations';
import { usePayoutAccountsQuery } from '../data/queries';
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
	const { theme } = useTheme();
	const { bankCode, accountNumber, accountName } = route.params;
	const createPayoutAccountMutation = useCreatePayoutAccountMutation();
	const { data: payoutAccountsData } = usePayoutAccountsQuery();

	const bankName = BANKS_BY_CODE[bankCode]?.name;

	const isReplacement = (payoutAccountsData?.payoutAccounts?.length ?? 0) > 0;

	const [error, setError] = React.useState<string | null>(null);

	const onConfirm = React.useCallback(async () => {
		setError(null);

		try {
			await createPayoutAccountMutation.mutateAsync({
				bankAccountNumber: accountNumber,
				bankCode,
				...(isReplacement ? { replaceExisting: true } : {})
			});

			navigation.getParent()?.goBack();
		} catch {
			setError(
				'We could not save this payout account. Please try again, or check whether you have a payout awaiting confirmation.'
			);
		}
	}, [
		accountNumber,
		bankCode,
		isReplacement,
		createPayoutAccountMutation,
		navigation
	]);

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
			{error && (
				<>
					<Spacer y={16} />
					<Typography size='small' style={{ color: theme.text.error }}>
						{error}
					</Typography>
				</>
			)}
			<Spacer y={16} />
			<Button
				text='Confirm details'
				onPress={onConfirm}
				loading={createPayoutAccountMutation.isPending}
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
