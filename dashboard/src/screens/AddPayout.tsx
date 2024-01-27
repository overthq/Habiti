import React from 'react';
import { View, StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Screen from '../components/global/Screen';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import AmountDisplay from '../components/add-payout/AmountDisplay';

// _: ""
// +1 :  "1" -> "1.00"
// +2 : "12" -> "12.00"
// +3 : "123" -> "123.00"
// < : "12" -> "12.00"
// +. : "12." -> "12.00"
// +. : "12." -> "12.00" (edge case)
// < : "1" -> "1.00" (edge case)
// +. : "1." -> "1.00"
// +0 : "1.0" -> "1.00"
// +5 : "1.05" -> "1.05"

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	useGoBack('x');

	const handleAddPayout = React.useCallback(() => {
		// Mutation code
	}, []);

	const handleDelete = React.useCallback(() => {
		setAmount(a => a.slice(0, -1));
	}, []);

	const handleUpdate = React.useCallback((value: string) => {
		if (value === '.') {
			// Special case?
		} else {
			setAmount(a => a + value);
		}
	}, []);

	const handleClear = React.useCallback(() => {
		setAmount('');
	}, []);

	return (
		<Screen style={styles.container}>
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

const styles = StyleSheet.create({
	container: {
		// borderColor: 'red',
		// borderWidth: 1
	},
	input: {
		marginVertical: 8
	}
});

export default AddPayout;
