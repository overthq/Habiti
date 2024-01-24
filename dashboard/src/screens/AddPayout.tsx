import React from 'react';
import { View, StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Screen from '../components/global/Screen';
import PayoutNumpad from '../components/add-payout/PayoutNumpad';
import AmountDisplay from '../components/add-payout/AmountDisplay';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	useGoBack('x');

	const handleAddPayout = React.useCallback(() => {
		// Mutation code
	}, []);

	const noop = React.useCallback(() => {
		// Do nothing
	}, []);

	const handleClear = React.useCallback(() => {
		setAmount('');
	}, []);

	return (
		<Screen style={styles.container}>
			<AmountDisplay amount={amount} />
			<PayoutNumpad onUpdate={noop} onClear={handleClear} onDelete={noop} />
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
