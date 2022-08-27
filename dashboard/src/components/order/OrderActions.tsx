import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const OrderActions: React.FC = () => {
	return (
		<View style={styles.container}>
			<Pressable>
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
		padding: 16
	}
});

export default OrderActions;
