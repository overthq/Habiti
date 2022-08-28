import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../global/Button';

// Buttons:
// - If pending, mark as fulfilled | cancelled
// - If fulfilled, move back to pending | cancelled
// - If cancelled, set as pending?

const OrderActions: React.FC = () => {
	return (
		<View style={styles.container}>
			<Button
				text='Mark as fulfilled'
				onPress={() => {
					console.log('Something');
				}}
				style={{ marginRight: 16, height: 40, backgroundColor: '#505050' }}
			/>
			<Button
				text='Cancel'
				onPress={() => {
					// fdf
					console.log('Something');
				}}
				style={{ height: 40 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		flexDirection: 'row'
	}
});

export default OrderActions;
