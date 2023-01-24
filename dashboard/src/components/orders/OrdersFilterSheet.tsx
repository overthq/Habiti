import React from 'react';
import { View, Text } from 'react-native';
import Button from '../global/Button';

const OrdersFilterSheet = () => {
	return (
		<View>
			<View>
				<Text>Status</Text>
			</View>
			<View>
				<Text>Total</Text>
			</View>
			<View>
				<Text>Created</Text>
			</View>
			<Button text='Apply filter' />
		</View>
	);
};

export default OrdersFilterSheet;
