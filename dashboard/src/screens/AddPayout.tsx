import React from 'react';
import { StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Input from '../components/global/Input';
import Screen from '../components/global/Screen';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	useGoBack();

	const handleAddPayout = React.useCallback(() => {
		// Mutation code
	}, []);

	return (
		<Screen style={styles.container}>
			<Input
				value={amount}
				onChangeText={setAmount}
				placeholder='Payout amount'
				style={styles.input}
			/>
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
