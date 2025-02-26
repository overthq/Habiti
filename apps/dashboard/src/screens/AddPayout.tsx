import { HoldableButton, Screen } from '@habiti/components';
import React from 'react';
import { View } from 'react-native';

import AmountDisplay from '../components/add-payout/AmountDisplay';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import useGoBack from '../hooks/useGoBack';
import { useCreatePayoutMutation } from '../types/api';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	const [, createPayout] = useCreatePayoutMutation();
	useGoBack('x');

	const handleAddPayout = React.useCallback(async () => {
		const { error } = await createPayout({
			input: { amount: Number(amount) * 100 }
		});

		if (error) {
			console.log(error);
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
				<HoldableButton text='Add Payout' onComplete={handleAddPayout} />
			</View>
		</Screen>
	);
};

export default AddPayout;
