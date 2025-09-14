import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Screen } from '@habiti/components';
import { useNavigation } from '@react-navigation/native';

import AmountDisplay from '../components/add-payout/AmountDisplay';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import useGoBack from '../hooks/useGoBack';
import { useCreatePayoutMutation } from '../types/api';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	const [{ fetching }, createPayout] = useCreatePayoutMutation();
	const { goBack } = useNavigation();
	useGoBack('x');

	const confirmAddPayout = () => {
		Alert.alert(
			'Confirm payout',
			'This will send the specified amount to the configured bank account',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Confirm', onPress: handleAddPayout }
			]
		);
	};

	const handleAddPayout = React.useCallback(async () => {
		const { error } = await createPayout({
			input: { amount: Number(amount) * 100 }
		});

		if (error) {
			console.log(error);
		} else {
			goBack();
		}
	}, [amount]);

	const lastCharIsDot = React.useMemo(() => {
		return amount.charAt(amount.length - 1) === '.';
	}, [amount]);

	const handleDelete = React.useCallback(() => {
		setAmount(a => a.slice(0, -(lastCharIsDot ? 2 : 1)));
	}, [lastCharIsDot]);

	const handleUpdate = React.useCallback(
		(value: string) => {
			if (!(lastCharIsDot && value === '.')) {
				setAmount(a => a + value);
			}
		},
		[lastCharIsDot]
	);

	const handleClear = React.useCallback(() => {
		setAmount('');
	}, []);

	return (
		<Screen>
			<AmountDisplay amount={amount} />
			<PayoutNumpad
				onUpdate={handleUpdate}
				onClear={handleClear}
				onDelete={handleDelete}
			/>
			<View style={{ marginBottom: 56, paddingHorizontal: 16 }}>
				<Button
					disabled={!amount}
					text='Add Payout'
					loading={fetching}
					onPress={confirmAddPayout}
				/>
			</View>
		</Screen>
	);
};

export default AddPayout;
