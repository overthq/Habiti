import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { formatNaira } from '@habiti/common';
import { Button, Icon, Screen, Spacer, Typography } from '@habiti/components';

import { useCreatePayoutMutation } from '../data/mutations';
import { useStoreBalanceQuery } from '../data/queries';
import type { AppStackScreenProps } from '../navigation/types';

/** The API reports failures as `{ message }` (see the central errorHandler). */
const getPayoutErrorMessage = (error: unknown): string | undefined => {
	const message = (
		error as { response?: { data?: { message?: unknown } } } | undefined
	)?.response?.data?.message;

	return typeof message === 'string' ? message : undefined;
};

const AddPayout: React.FC<AppStackScreenProps<'Modal.AddPayout'>> = ({
	navigation
}) => {
	const [amount, setAmount] = React.useState('');
	const createPayoutMutation = useCreatePayoutMutation();
	const { data: balanceData } = useStoreBalanceQuery();

	const balance = balanceData?.balance;
	const availableBalance = (balance?.available ?? 0) / 100;
	const pendingPayouts = balance?.pendingPayouts ?? 0;

	const confirmAddPayout = () => {
		Alert.alert(
			'Confirm payout',
			pendingPayouts > 0
				? `You already have ${formatNaira(pendingPayouts)} awaiting confirmation. This will send an additional ${formatNaira(Number(amount) * 100)} to the configured bank account.`
				: 'This will send the specified amount to the configured bank account',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Confirm', onPress: handleAddPayout }
			]
		);
	};

	const handleAddPayout = React.useCallback(async () => {
		try {
			await createPayoutMutation.mutateAsync({
				amount: Number(amount) * 100
			});
		} catch (error) {
			Alert.alert(
				'Payout failed',
				getPayoutErrorMessage(error) ??
					'We could not complete this payout. Please try again.'
			);

			return;
		}

		navigation.goBack();
	}, [amount, createPayoutMutation, navigation]);

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
			<Spacer y={16} />
			<AmountDisplay amount={amount} />
			<PayoutNumpad
				onUpdate={handleUpdate}
				onClear={handleClear}
				onDelete={handleDelete}
			/>
			<View style={{ marginBottom: 56 }}>
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

interface AmountDisplayProps {
	amount: string;
}

const AmountDisplay: React.FC<AmountDisplayProps> = ({ amount }) => {
	const display = React.useMemo(() => {
		return formatNaira(Number(amount) * 100);
	}, [amount]);

	return (
		<View style={amountStyles.container}>
			<Typography
				style={amountStyles.amount}
				weight='bold'
				size='xxxlarge'
				number
			>
				{display}
			</Typography>
		</View>
	);
};

const amountStyles = StyleSheet.create({
	container: {
		flexGrow: 1,
		paddingVertical: 56,
		justifyContent: 'center'
	},
	amount: {
		textAlign: 'center',
		fontSize: 52
	}
});

interface PayoutNumpadProps {
	onUpdate(text: string): void;
	onDelete(): void;
	onClear(): void;
}

// FIXME: Some weird styling issues here still mean that
// the '0' button is slightly skewed to the left.
// (It's visible with a border around the numpad buttons).

const PayoutNumpad: React.FC<PayoutNumpadProps> = ({
	onUpdate,
	onDelete,
	onClear
}) => {
	return (
		<View>
			<View style={numpadStyles.row}>
				<NumpadButton value='1' onPress={() => onUpdate('1')} />
				<NumpadButton value='2' onPress={() => onUpdate('2')} />
				<NumpadButton value='3' onPress={() => onUpdate('3')} />
			</View>
			<View style={numpadStyles.row}>
				<NumpadButton value='4' onPress={() => onUpdate('4')} />
				<NumpadButton value='5' onPress={() => onUpdate('5')} />
				<NumpadButton value='6' onPress={() => onUpdate('6')} />
			</View>
			<View style={numpadStyles.row}>
				<NumpadButton value='.' onPress={() => onUpdate('.')} />
				<NumpadButton value='0' onPress={() => onUpdate('0')} />
				<Pressable
					style={numpadStyles.back}
					onPress={onDelete}
					onLongPress={onClear}
				>
					<Icon size={24} name='delete' />
				</Pressable>
			</View>
		</View>
	);
};

const numpadStyles = StyleSheet.create({
	cell: {
		flexGrow: 1,
		padding: 8
	},
	back: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 56
	}
});

interface NumpadButtonProps {
	value: string;
	onPress(): void;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ value, onPress }) => {
	return (
		<Pressable style={numpadButtonStyles.container} onPress={onPress}>
			<Typography
				size='xxxlarge'
				weight='medium'
				style={numpadButtonStyles.text}
				number
			>
				{value}
			</Typography>
		</Pressable>
	);
};

const numpadButtonStyles = StyleSheet.create({
	container: {
		padding: 8,
		flexGrow: 1,
		justifyContent: 'center',
		alignContent: 'center'
	},
	text: {
		textAlign: 'center'
	}
});

export default AddPayout;
