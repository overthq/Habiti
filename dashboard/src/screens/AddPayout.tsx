import React from 'react';
import { StyleSheet } from 'react-native';
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
			<Button text='Add payout' onPress={handleAddPayout} />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16
	},
	input: {
		marginVertical: 8
	}
});

export default AddPayout;
