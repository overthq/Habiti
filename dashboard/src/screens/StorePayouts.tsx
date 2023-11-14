import React from 'react';
import { StyleSheet } from 'react-native';
import Screen from '../components/global/Screen';
import Input from '../components/global/Input';
import useGoBack from '../hooks/useGoBack';

// What settings should store owners be able to control from here?
// Account settings (account number, bank)
// Generate account name from these details

const StorePayouts = () => {
	useGoBack();

	return (
		<Screen style={styles.container}>
			<Input style={styles.input} label='Account Number' />
			<Input style={styles.input} label='Bank' />
		</Screen>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 16,
		paddingHorizontal: 16
	},
	input: {
		marginBottom: 8
	}
});

export default StorePayouts;
