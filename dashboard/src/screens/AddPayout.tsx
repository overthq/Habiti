import React from 'react';
import { View } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Screen from '../components/global/Screen';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import AmountDisplay from '../components/add-payout/AmountDisplay';
import { useCreatePayoutMutation } from '../types/api';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	const [, createPayout] = useCreatePayoutMutation();
	useGoBack('x');

	const handleAddPayout = React.useCallback(() => {
		try {
			createPayout({ input: { amount: Number(amount) * 100 } });
		} catch (error) {
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
			<View style={{ marginTop: 32, paddingHorizontal: 16 }}>
				<Button text='Add payout' onPress={handleAddPayout} />
			</View>
		</Screen>
	);
};

export default AddPayout;
