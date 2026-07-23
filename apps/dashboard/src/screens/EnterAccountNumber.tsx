import React from 'react';
import {
	Button,
	Input,
	ScrollableScreen,
	Spacer,
	Typography,
	useTheme
} from '@habiti/components';

import { useVerifyBankAccountMutation } from '../data/mutations';
import { BANKS_BY_CODE } from '../utils/transform';
import { PayoutAccountStackScreenProps } from '../navigation/types';

const EnterAccountNumber: React.FC<
	PayoutAccountStackScreenProps<'PayoutAccount.EnterAccount'>
> = ({ navigation, route }) => {
	const { bankCode } = route.params;
	const { theme } = useTheme();
	const verifyBankAccountMutation = useVerifyBankAccountMutation();

	const [accountNumber, setAccountNumber] = React.useState('');
	const [error, setError] = React.useState<string | null>(null);

	const bankName = BANKS_BY_CODE[bankCode]?.name;

	const onContinue = React.useCallback(async () => {
		setError(null);

		try {
			const data = await verifyBankAccountMutation.mutateAsync({
				bankAccountNumber: accountNumber,
				bankCode
			});

			navigation.navigate('PayoutAccount.Confirm', {
				bankCode,
				accountNumber,
				accountName: data?.accountName
			});
		} catch {
			setError(
				'We could not verify this account. Please check the number and try again.'
			);
		}
	}, [accountNumber, bankCode, verifyBankAccountMutation, navigation]);

	return (
		<ScrollableScreen>
			<Spacer y={16} />
			<Typography variant='secondary'>{bankName}</Typography>
			<Spacer y={8} />
			<Input
				label='Account Number'
				placeholder='Account Number'
				value={accountNumber}
				onChangeText={value => {
					setAccountNumber(value);
					if (error) setError(null);
				}}
				keyboardType='number-pad'
				autoFocus
			/>
			{error && (
				<>
					<Spacer y={8} />
					<Typography size='small' style={{ color: theme.text.error }}>
						{error}
					</Typography>
				</>
			)}
			<Spacer y={16} />
			<Button
				text='Continue'
				onPress={onContinue}
				disabled={accountNumber.length === 0}
				loading={verifyBankAccountMutation.isPending}
			/>
		</ScrollableScreen>
	);
};

export default EnterAccountNumber;
