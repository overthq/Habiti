import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// If order is "Pending", have buttons to either cancel or fulfil.
// If it is fulfilled, have button to mark as ready for delivery.
// We should create a batch, and then have a way to approve the batch for
// pickup (secondary for the initial version).

const OrderActions: React.FC = () => {
	return (
		<View style={styles.container}>
			<Pressable style={{ marginRight: 16 }}>
				<Text>Mark as fulfilled</Text>
			</Pressable>

			<Pressable>
				<Text>Cancel order</Text>
			</Pressable>
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
