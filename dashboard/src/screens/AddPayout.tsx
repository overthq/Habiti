import React from 'react';
import { View, StyleSheet } from 'react-native';
import useGoBack from '../hooks/useGoBack';
import Button from '../components/global/Button';
import Input from '../components/global/Input';

const AddPayout: React.FC = () => {
	const [amount, setAmount] = React.useState('');
	useGoBack();

	const handleAddPayout = React.useCallback(() => {
		// Mutation code
	}, []);

	return (
		<View style={styles.container}>
			<Input
				value={amount}
				onChangeText={setAmount}
				placeholder='Payout amount'
				style={styles.input}
			/>
			<Button text='Add payout' onPress={handleAddPayout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#FFFFFF'
	},
	input: {
		marginVertical: 8
	}
});

export default AddPayout;
