import React from 'react';
import { Alert, View } from 'react-native';
import { Button, Screen } from '@habiti/components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import AmountDisplay from '../components/add-payout/AmountDisplay';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import useGoBack from '../hooks/useGoBack';
import { useCreatePayoutMutation } from '../data/mutations';
import { AppStackParamList } from '../types/navigation';

const AddPayout = () => {
	const [amount, setAmount] = React.useState('');
	const createPayoutMutation = useCreatePayoutMutation();
	const { goBack } = useNavigation();
	const { params } =
		useRoute<RouteProp<AppStackParamList, 'Modal.AddPayout'>>();
	useGoBack('x');

	const availableBalance = (params.realizedRevenue - params.paidOut) / 100;

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
		await createPayoutMutation.mutateAsync({
			amount: Number(amount) * 100
		});

		goBack();
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
					disabled={
						availableBalance === 0 ||
						!amount ||
						Number(amount) > availableBalance
					}
					text={
						availableBalance === 0
							? 'No available balance'
							: Number(amount) > availableBalance
								? 'Insufficient balance'
								: 'Add Payout'
					}
					loading={createPayoutMutation.isPending}
					onPress={confirmAddPayout}
				/>
			</View>
		</Screen>
	);
};

export default AddPayout;
